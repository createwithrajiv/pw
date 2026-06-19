# Rajiv Kumar Yadav — Portfolio

A premium, dark-first, single-page portfolio for an AI Engineer. Built with React 18,
TypeScript, Vite, TailwindCSS, Framer Motion, GSAP, Lenis smooth scroll, and a React
Three Fiber "neural constellation" hero.

**Every word, number, project, and link on the site comes from `src/data/*.json`.**
No user content is hardcoded in components — edit the JSON and the site updates with
zero code changes.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck (tsc -b) + production build
npm run preview    # serve the production build
npm run typecheck  # type-check only
npm run lint       # eslint
```

## Editing content (the single source of truth: `src/data/`)

| File | Drives |
|------|--------|
| `profile.json` | Hero, About, Contact (name, tagline, stats, email, résumé, availability) |
| `skills.json` | Skills section (categories + skills) |
| `services.json` | Services cards (`icon` = a lucide name) |
| `experience.json` | Experience timeline |
| `projects.json` | Projects grid + detail modal (`link`/`github` of `"#"` are treated as "no link") |
| `testimonials.json` | Testimonials |
| `social.json` | Social links everywhere (`icon` = a lucide name) |
| `metrics.json` | Animated achievement counters (falls back to `profile.stats`) |
| `personal-story.json` / `values.json` | Story section (narrative + principles) |
| `certifications.json` · `blog.json` · `faq.json` | Those sections (empty ones auto-hide) |
| `cta.json` | Final call-to-action |
| `navigation.json` | Brand + résumé CTA |
| `seo.json` | `<title>`, Open Graph, Twitter, JSON-LD Person |
| `technologies.json` | About-card marquee |
| `animations.json` | Motion timing tokens |
| `website-settings.json` | **Section order, on/off, auto-hide, theme default, feature flags** |

### Section ordering & visibility

`website-settings.json` → `sections[]` controls the page. The array order is the page
order; flip `enabled` to hide a section; set `hideWhenEmpty: true` and a section vanishes
(from the page **and** the nav) when its data is empty. Adding a brand-new section is one
entry here plus one entry in `src/constants/sectionRegistry.tsx`.

### Icons

`icon` strings in the JSON (e.g. `"server"`, `"shield-check"`) resolve to
[lucide](https://lucide.dev) icons via `src/constants/icons.ts`, with a safe fallback —
an unknown name never breaks the build. Add new ones in that file.

## Architecture

```
src/
  data/        JSON content + index.ts (the typed single-source-of-truth barrel)
  types/       one interface per data shape
  hooks/       useContent accessors + motion/scroll hooks
  providers/   Theme, ReducedMotion, SmoothScroll (Lenis↔GSAP single rAF)
  constants/   section registry + icon map
  animations/  Framer variant library
  components/  ui primitives, motion helpers, layout chrome, three/ (R3F hero), seo
  sections/    one component per section, each reads its own JSON
  pages/       HomePage (maps the resolved section list), 404
  themes/      design tokens (:root + .dark) + global styles
```

## Notes / things to update

- `social.json` and `testimonials.json` ship with placeholder identities ("Alex",
  `example.com`). Update those JSON values — no code changes needed.
- Add a real `public/og-image.png` (referenced by `seo.json`) and update `seo.json` `url`
  + `person.sameAs` with your real domain and social URLs.
- Accessibility: full keyboard nav, focus-trapped modal, reduced-motion support (OS flag
  or the in-UI "Motion" toggle in the footer), AA contrast in both themes.
