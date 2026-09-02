/**
 * Build-time prerender, without a browser.
 *
 * The app is client-rendered, so dist/index.html ships an empty
 * <div id="root"></div>. Googlebot executes JS and copes; most AI crawlers,
 * LinkedIn, Slack and Twitter do not — they see a blank page and no JSON-LD.
 *
 * A headless-Chromium snapshot was tried first and abandoned. Vercel's build
 * sandbox has no Chromium, and installing one there still failed with exit 127
 * because the system libraries Chromium links against are absent too. That is
 * not fixable from package.json.
 *
 * So this renders semantic HTML directly from src/data — the same JSON the
 * React components read, which is why the two cannot drift into saying
 * different things — and injects it into #root, plus the JSON-LD into <head>.
 *
 * main.tsx uses createRoot, not hydrateRoot, so React clears #root and rebuilds
 * on mount. There is no hydration to mismatch; this markup exists purely for
 * clients that never run the JavaScript.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));

const seo = read('seo.json');
const profile = read('profile.json');
const metrics = read('metrics.json');
const companies = read('companies.json');
const services = read('services.json');
const skills = read('skills.json');
const experience = read('experience.json');
const projects = read('projects.json');
const demos = read('demos.json');
const testimonials = read('testimonials.json');
const story = read('personal-story.json');
const values = read('values.json');
const faq = read('faq.json');
const writing = read('writing.json');
const social = read('social.json');
const copy = read('section-copy.json');
const settings = read('website-settings.json');

const SITE = seo.url.replace(/\/$/, '');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const enabled = (id) => settings.sections.some((s) => s.id === id && s.enabled);
const list = (items, fn) => (items ?? []).map(fn).join('');
const section = (id, inner) => `<section id="${id}">${inner}</section>`;
const heading = (c) =>
  (c?.eyebrow ? `<p>${esc(c.eyebrow)}</p>` : '') +
  (c?.title ? `<h2>${esc(c.title)}</h2>` : '') +
  (c?.subtitle ? `<p>${esc(c.subtitle)}</p>` : '');

const parts = [];

// Nav — the same anchors the real header renders.
parts.push(
  `<nav aria-label="Primary"><ul>${list(
    settings.sections.filter((s) => s.enabled && s.label.trim()),
    (s) => `<li><a href="${s.anchor}">${esc(s.label)}</a></li>`,
  )}</ul></nav>`,
);

parts.push(
  section(
    'hero',
    `<p>${esc(profile.availability)}</p>` +
      `<p>${esc(profile.name)} · ${esc(profile.title)}</p>` +
      `<h1>${esc(profile.tagline)}</h1>` +
      `<p>${esc(profile.description)}</p>` +
      `<p><a href="${esc(profile.resumeUrl)}">Download Résumé</a> <a href="#projects">View Work</a></p>` +
      `<ul>${list(
        metrics.items.filter((m) => m.hero),
        (m) =>
          `<li><strong>${esc((m.prefix ?? '') + m.value + (m.suffix ?? ''))}</strong> ${esc(
            m.shortLabel ?? m.label,
          )}</li>`,
      )}</ul>` +
      `<ul>${list(social, (s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.platform)}</a></li>`)}</ul>`,
  ),
);

if (enabled('metrics')) {
  parts.push(
    section(
      'metrics',
      `<h2>${esc(metrics.heading)}</h2><ul>${list(
        metrics.items,
        (m) =>
          `<li><strong>${esc((m.prefix ?? '') + m.value + (m.suffix ?? ''))}</strong> ${esc(m.label)}` +
          (m.context ? ` — ${esc(m.context)}` : '') +
          (m.details
            ? `<div><h3>${esc(m.details.heading)}</h3>` +
              (m.details.intro ? `<p>${esc(m.details.intro)}</p>` : '') +
              list(
                m.details.groups,
                (g) =>
                  (g.title ? `<h4>${esc(g.title)}</h4>` : '') +
                  `<ul>${list(g.items, (i) => `<li><strong>${esc(i.name)}</strong> — ${esc(i.note)}</li>`)}</ul>`,
              ) +
              `</div>`
            : '') +
          `</li>`,
      )}</ul>`,
    ),
  );
}

if (enabled('logos')) {
  parts.push(
    section(
      'logos',
      `<h2>Experience across teams at</h2><ul>${list(
        companies,
        (c) => `<li><a href="${esc(c.website)}" rel="noopener">${esc(c.name)}</a></li>`,
      )}</ul>`,
    ),
  );
}

if (enabled('about')) {
  parts.push(
    section(
      'about',
      `<h2>${esc(story.heading)}${story.subheading ? ' ' + esc(story.subheading) : ''}</h2>` +
        `<p>${esc(profile.description)}</p>` +
        `<p>${esc(profile.longDescription ?? '')}</p>` +
        `<p>Currently ${esc(profile.title)}, ${esc(profile.location)}. ${esc(profile.availability)}</p>`,
    ),
  );
}

if (enabled('services')) {
  parts.push(
    section(
      'services',
      heading(copy.services) +
        `<ul>${list(services, (s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></li>`)}</ul>`,
    ),
  );
}

if (enabled('skills')) {
  parts.push(
    section(
      'skills',
      heading(copy.skills) +
        `<ul>${list(
          skills.categories,
          (c) =>
            `<li><h3>${esc(c.title)}</h3><ul>${list(
              c.items,
              (i) => `<li>${esc(typeof i === 'string' ? i : i.name)}</li>`,
            )}</ul></li>`,
        )}</ul>`,
    ),
  );
}

if (enabled('experience')) {
  parts.push(
    section(
      'experience',
      heading(copy.experience) +
        `<ul>${list(
          experience,
          (e) =>
            `<li><h3>${esc(e.role)} — ${esc(e.company)}</h3>` +
            `<p>${esc(e.period)}${e.location ? ' · ' + esc(e.location) : ''}</p>` +
            `<ul>${list(e.highlights ?? e.achievements, (h) => `<li>${esc(h)}</li>`)}</ul></li>`,
        )}</ul>`,
    ),
  );
}

if (enabled('projects')) {
  parts.push(
    section(
      'projects',
      heading(copy.projects) +
        `<ul>${list(
          projects,
          (p) =>
            `<li><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>` +
            (p.tech?.length ? `<p>${esc(p.tech.join(', '))}</p>` : '') +
            (p.github && p.github !== '#'
              ? `<p><a href="${esc(p.github)}" rel="noopener">Source code</a></p>`
              : '') +
            `</li>`,
        )}</ul>`,
    ),
  );
}

if (enabled('demos') && demos.items.length) {
  parts.push(
    section(
      'demos',
      `<h2>Product walkthroughs</h2><p>${esc(demos.notice)}</p><ul>${list(
        demos.items,
        (d) => `<li><h3>${esc(d.title)}</h3><p>${esc(d.summary)}</p></li>`,
      )}</ul>`,
    ),
  );
}

if (enabled('testimonials')) {
  parts.push(
    section(
      'testimonials',
      heading(copy.testimonials) +
        `<ul>${list(
          testimonials,
          (t) =>
            `<li><blockquote>${esc(t.quote)}</blockquote>` +
            `<p>${esc(t.author)}, ${esc(t.role)}, ${esc(t.company)}</p></li>`,
        )}</ul>`,
    ),
  );
}

if (enabled('story')) {
  parts.push(
    section(
      'story',
      `<h2>${esc(story.heading)}</h2>` +
        list(story.paragraphs, (p) => `<p>${esc(p)}</p>`) +
        `<h3>${esc(values.heading)}</h3><ul>${list(
          values.items,
          (v) => `<li><strong>${esc(v.title)}</strong> — ${esc(v.description)}</li>`,
        )}</ul>`,
    ),
  );
}

if (enabled('faq')) {
  parts.push(
    section(
      'faq',
      `<h2>${esc(faq.heading)}</h2><dl>${list(
        faq.items,
        (q) => `<dt>${esc(q.question)}</dt><dd>${esc(q.answer)}</dd>`,
      )}</dl>`,
    ),
  );
}

if (enabled('writing')) {
  parts.push(
    section(
      'writing',
      `<h2>${esc(writing.newsletter.name)}</h2><p>${esc(writing.newsletter.tagline)}</p>` +
        `<ul>${list(
          writing.posts,
          (p) =>
            `<li><a href="${esc(p.url)}" rel="noopener"><h3>${esc(p.title)}</h3></a>` +
            `<p>${esc(p.excerpt)}</p></li>`,
        )}</ul>` +
        `<p><a href="${esc(writing.newsletter.subscribeUrl)}" rel="noopener">Subscribe</a></p>`,
    ),
  );
}

parts.push(
  section(
    'contact',
    `<h2>Get in touch</h2><p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></p>` +
      `<p>${esc(profile.location)}</p>`,
  ),
);

parts.push(
  `<footer><p>${esc(profile.name)} — ${esc(profile.title)}</p>` +
    `<p>&copy; ${new Date().getFullYear()} ${esc(profile.name)}. All rights reserved.</p></footer>`,
);

// JSON-LD, mirroring src/utils/seo.ts buildJsonLd.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE}#person`,
      name: seo.person.name,
      jobTitle: seo.person.jobTitle,
      url: SITE,
      email: seo.person.email,
      image: `${SITE}${seo.ogImage}`,
      description: seo.description,
      sameAs: seo.person.sameAs,
      address: {
        '@type': 'PostalAddress',
        addressLocality: seo.person.address.locality,
        addressCountry: seo.person.address.country,
      },
      knowsAbout: seo.keywords,
      ...(experience[0] ? { worksFor: { '@type': 'Organization', name: experience[0].company } } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}#website`,
      url: SITE,
      name: seo.title,
      description: seo.description,
      publisher: { '@id': `${SITE}#person` },
      inLanguage: 'en',
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}#profilepage`,
      url: SITE,
      name: seo.title,
      about: { '@id': `${SITE}#person` },
      isPartOf: { '@id': `${SITE}#website` },
    },
  ],
};

const file = join(root, 'dist/index.html');
let html = readFileSync(file, 'utf8');

if (html.includes('data-prerendered')) {
  console.warn('  prerender skipped — dist/index.html is already prerendered.');
  process.exit(0);
}

const body = parts.join('\n');
html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
html = html.replace(
  '</head>',
  `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
);
html = html.replace('<html lang="en">', '<html lang="en" data-prerendered="true">');

writeFileSync(file, html, 'utf8');

const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const headings = (body.match(/<h[1-4][ >]/g) || []).length;
console.log(
  `  prerendered dist/index.html — ${(html.length / 1024).toFixed(0)} KB, ` +
    `${text.length.toLocaleString()} chars of text, ${headings} headings, JSON-LD injected`,
);
