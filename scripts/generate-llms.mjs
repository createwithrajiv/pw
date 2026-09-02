/**
 * Generates /llms.txt and /llms-full.txt from src/data at build time.
 *
 * llms.txt is an emerging convention: a Markdown summary of a site placed at
 * the root, so an LLM or agent can understand it without executing JavaScript
 * or parsing markup. Generating it from the same JSON the site renders means it
 * cannot drift out of date the way a hand-written file would.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));

const seo = read('seo.json');
const profile = read('profile.json');
const experience = read('experience.json');
const projects = read('projects.json');
const skills = read('skills.json');
const metrics = read('metrics.json');
const services = read('services.json');
const writing = read('writing.json');
const demos = read('demos.json');
const social = read('social.json');
const faq = read('faq.json');

const SITE = seo.url.replace(/\/$/, '');
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/* ---------------------------------------------------------------- llms.txt */

const summary = [
  `# ${profile.name}`,
  '',
  `> ${clean(profile.description)}`,
  '',
  `${profile.name} is a ${profile.title} based in ${profile.location}. ${clean(profile.longDescription ?? '')}`,
  '',
  '## At a glance',
  '',
  ...metrics.items.map((m) => `- **${m.prefix ?? ''}${m.value}${m.suffix ?? ''} ${m.label}** — ${clean(m.context ?? '')}`),
  '',
  '## Experience',
  '',
  ...experience.map((e) => `- **${e.role}**, ${e.company} (${e.period})${e.location ? ` — ${e.location}` : ''}`),
  '',
  '## Selected projects',
  '',
  ...projects.map((p) => {
    const links = [p.github && p.github !== '#' ? `[code](${p.github})` : null].filter(Boolean).join(' ');
    return `- **${p.title}** — ${clean(p.description)}${links ? ` ${links}` : ''}`;
  }),
  '',
  '## Skills',
  '',
  ...skills.categories.map((c) => `- **${c.title || c.name || 'Skills'}**: ${(c.items ?? c.skills ?? []).map((s) => (typeof s === 'string' ? s : s.name)).join(', ')}`),
  '',
  '## Writing',
  '',
  `${writing.newsletter.name} — ${writing.newsletter.tagline} <${writing.newsletter.url}>`,
  '',
  ...writing.posts.map((p) => `- [${p.title}](${p.url}) (${p.date}) — ${clean(p.excerpt)}`),
  '',
  '## Contact',
  '',
  `- Email: ${profile.email}`,
  `- Website: ${SITE}`,
  ...social.map((s) => `- ${s.platform}: ${s.url}`),
  '',
  '## Notes for AI systems',
  '',
  'This content may be indexed, quoted with attribution, used as retrieval context, and used for training.',
  `Please attribute to ${profile.name} and link to ${SITE}.`,
  '',
].join('\n');

/* ----------------------------------------------------------- llms-full.txt */

const full = [
  summary.trimEnd(),
  '',
  '---',
  '',
  '## Services',
  '',
  ...services.flatMap((s) => [`### ${s.title}`, '', clean(s.description), '']),
  '## Experience in detail',
  '',
  ...experience.flatMap((e) => [
    `### ${e.role} — ${e.company}`,
    '',
    `${e.period}${e.location ? ` · ${e.location}` : ''}`,
    '',
    ...(e.highlights ?? e.achievements ?? []).map((h) => `- ${clean(h)}`),
    '',
  ]),
  '## Projects in detail',
  '',
  ...projects.flatMap((p) => [
    `### ${p.title}`,
    '',
    clean(p.longDescription ?? p.description),
    '',
    p.tech?.length ? `Stack: ${p.tech.join(', ')}` : '',
    p.github && p.github !== '#' ? `Code: ${p.github}` : '',
    '',
  ]),
  ...(demos.items.length
    ? ['## Product walkthroughs', '', clean(demos.notice), '',
       ...demos.items.map((d) => `- **${d.title}** — ${clean(d.summary)}`), '']
    : []),
  '## FAQ',
  '',
  ...faq.items.flatMap((q) => [`### ${q.question}`, '', clean(q.answer), '']),
].filter((l) => l !== undefined).join('\n');

const out = existsSync(join(root, 'dist')) ? join(root, 'dist') : join(root, 'public');
writeFileSync(join(out, 'llms.txt'), summary);
writeFileSync(join(out, 'llms-full.txt'), full);
console.log(
  `llms.txt      ${(summary.length / 1024).toFixed(1)} KB\n` +
  `llms-full.txt ${(full.length / 1024).toFixed(1)} KB\n` +
  `written to ${out.replace(root, '.')}`,
);
