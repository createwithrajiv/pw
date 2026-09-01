/**
 * Post-build prerender.
 *
 * The app is a client-rendered SPA, so dist/index.html ships an empty
 * <div id="root"></div>. Googlebot executes JS and copes, but most AI crawlers,
 * LinkedIn, Slack and Twitter do not — they see a blank page and no JSON-LD.
 *
 * This loads the built site in headless Chromium, waits for React to render and
 * for the scroll-triggered sections to settle, then writes the resulting HTML
 * back into dist/index.html.
 *
 * Safe by construction: main.tsx uses createRoot (not hydrateRoot), so React
 * clears #root and rebuilds on mount. There is no hydration to mismatch — the
 * snapshot is purely what non-JS clients read.
 *
 * If a browser cannot be launched the build continues with a warning rather
 * than failing; you get the SPA you had before, not a broken deploy.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const PORT = 4319;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = join(dist, url === '/' ? 'index.html' : url);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(dist, 'index.html'); // SPA fallback
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(PORT, r));

if ((await readFile(join(dist, 'index.html'), 'utf8')).includes('data-prerendered')) {
  console.warn('  prerender skipped — dist/index.html is already prerendered. Run a clean build first.');
  server.close();
  process.exit(0);
}

let browser;
try {
  const puppeteer = (await import('puppeteer')).default;
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
} catch (err) {
  console.warn(`\n  prerender skipped — could not launch a browser (${err.message.split('\n')[0]})`);
  console.warn('  the build is still valid; crawlers will see the SPA shell.\n');
  server.close();
  process.exit(0);
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0', timeout: 60_000 });

  // Sections reveal on scroll, so their content sits at opacity 0 until seen.
  // Walk the page to trigger every reveal, then return to the top.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  // Strip the animation's residual inline transforms/opacity. Text left at
  // opacity:0 reads as hidden content to a search engine.
  const stripped = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('[style]')) {
      const s = el.getAttribute('style') || '';
      if (/opacity|transform|filter/.test(s)) {
        const kept = s
          .split(';')
          .filter((d) => d.trim() && !/^\s*(opacity|transform|filter|-webkit-transform)\s*:/.test(d))
          .join(';');
        kept ? el.setAttribute('style', kept) : el.removeAttribute('style');
        n++;
      }
    }
    // The app repaints from scratch on mount, so mark the snapshot for clarity.
    document.documentElement.setAttribute('data-prerendered', 'true');
    return n;
  });

  const html = await page.content();
  await writeFile(join(dist, 'index.html'), html, 'utf8');

  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim().length);
  const h = await page.evaluate(() => document.querySelectorAll('h1,h2,h3').length);
  const ld = await page.evaluate(() => document.querySelectorAll('script[type="application/ld+json"]').length);
  console.log(
    `  prerendered dist/index.html — ${(html.length / 1024).toFixed(0)} KB, ` +
    `${text.toLocaleString()} chars of text, ${h} headings, ${ld} JSON-LD block(s), ` +
    `${stripped} inline animation styles cleared`,
  );
} finally {
  await browser.close();
  server.close();
}
