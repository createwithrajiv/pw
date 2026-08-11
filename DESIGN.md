# Design System

The design reference for rajivyadav.com. Several code comments cite "the design doc" - this is it.

**Source of truth is code, not this file.** Tokens live in [`src/themes/tokens.css`](src/themes/tokens.css) and the scales in [`tailwind.config.ts`](tailwind.config.ts). This document explains *why* each value is what it is, so nobody has to re-derive the reasoning to make a safe change. If the two disagree, the code wins and this file is stale - fix it.

| Concern | File |
|---|---|
| Colour tokens, both themes | `src/themes/tokens.css` |
| Type scale, radius, shadow, spacing, container | `tailwind.config.ts` |
| Base element styles, `.panel`, `.eyebrow`, focus, scrollbars | `src/themes/globals.css` |
| Syntax highlighting | `src/themes/code.css` |
| Motion vocabulary | `src/animations/variants.ts` |
| Theme resolution + persistence | `src/providers/ThemeProvider.tsx` |
| Reduced-motion gate | `src/providers/ReducedMotionProvider.tsx` |

---

## 1. Philosophy

Seven principles. Each is enforced somewhere in code, and most exist because the earlier version of the site violated them.

### 1.1 One accent colour

Blue is the only chromatic colour in the UI. Everything else is a neutral. Two sanctioned exceptions, both because the colour carries *information* rather than decoration:

- `--success` - the availability dot and check-marks. The neutral palette has no way to say "yes."
- The seven `--code-*` tokens - collapsing syntax highlighting onto one hue makes code unreadable.

The rule's real payoff is that accent means *interactive*. Which leads directly to:

### 1.2 Colour is not decoration - it is a signal

Eyebrow labels used to be accent-blue. Nineteen non-interactive blue labels were training visitors that blue means clickable, so they became muted grey. If something is blue, it responds to a click.

### 1.3 Light-first

`:root` is light. `.dark` overrides it. Light is the default and the primary experience (`themeDefault: "light"` in `website-settings.json`), and dark is a first-class equal - not an afterthought filter.

### 1.4 Accessibility is a constraint, not a pass at the end

Every text-bearing colour pair is checked against WCAG AA and the ratio is written into the token file as a comment. Tokens that *fail* were changed rather than shipped with an exception - see `--accent-fg` in dark mode (§3.4) and `--fg-subtle` (§3.2).

### 1.5 Structure through surface, not ornament

A long single-page site needs visible chapters. It gets them from alternating tinted bands (`<Section band>`) and hairline borders - zero performance cost, zero motion cost, no decorative flourishes. Glassmorphism was removed everywhere except the sticky navbar, which is the one place a blur earns its keep because it sits over scrolling content.

### 1.6 Restraint is designed in, not left out

The motion vocabulary is four things. The radius scale tops out at 12px. There is one easing curve. These are ceilings, deliberately chosen so the site cannot drift into inconsistency as it grows. Where a call site needed something bigger, the *token was capped* rather than the call site being trusted - `rounded-3xl` still compiles and still renders 12px.

### 1.7 Tokens over literals

No component hardcodes a colour. Every colour resolves through a CSS variable, which is what makes one definition cover both themes. A literal hex in a component is a bug.

---

## 2. Theme architecture

**Strategy:** `darkMode: 'class'` - `.dark` on `<html>`.

**Token format:** raw HSL channels, not full colour values.

```css
--accent: 221 83% 53%;        /* channels only */
```
```ts
accent: 'hsl(var(--accent) / <alpha-value>)'   /* Tailwind applies alpha */
```

This is why `bg-accent/10` and `border-accent/25` work. A token authored as `#2563EB` could not take an alpha modifier.

**Three modes, cycling `light → dark → system → light`.** Persisted to `localStorage` under `theme`. In `system` mode the app live-follows `prefers-color-scheme` via a `matchMedia` listener, so changing the OS theme updates the page without a reload. `document.documentElement.style.colorScheme` is also set, so native form controls and scrollbars match.

> **Why three states cycle and not two:** an earlier version toggled between the two *resolved* values. Once a visitor touched it, `system` became unreachable and the OS preference was ignored forever.

**Every token is defined in both themes.** Some are theme-inverted rather than merely re-shaded - see `--accent-fg` (§3.4), `--scrim` (§3.6) and the shadows (§6).

---

## 3. Colour

Contrast ratios below are the ones recorded in the token file.

> **On the hex values.** Tokens are authored as HSL channels rounded to whole percentages, which is how Tailwind publishes its palette. Round-tripping those channels back to hex lands **1–2/255 off** the nominal value - `--accent: 221 83% 53%` renders `#2463EB`, not the `#2563EB` its comment names. The hex in this doc and in `tokens.css` is the *design intent* (the Tailwind palette anchor); the computed value is what paints. The delta is imperceptible and does not move any contrast ratio.
>
> **Don't "fix" this** by rewriting the channels to match the hex exactly - you'd lose the palette provenance and gain nothing visible.

### 3.1 Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-base` | `#FFFFFF` | `#0B1120` | Page background |
| `--bg-canvas` | `#FFFFFF` | `#0B1120` | Page background (alias) |
| `--surface` | `#F9FAFB` | `#111827` | Cards, panels, tinted bands |
| `--surface-hi` | `#F3F4F6` | `#1E293B` | One step raised from `surface` |

> **Gotcha - `base` and `canvas` are `backgroundColor` only.** They deliberately live under `theme.extend.backgroundColor`, not `colors`. Putting them in `colors` feeds every utility family, which made `text-base` emit a white *colour* rule that overrode Tailwind's stock `text-base` font-*size* - silently turning any element using it white-on-white. Do not move them.

### 3.2 Text

| Token | Light | Dark | Contrast (light / dark) |
|---|---|---|---|
| `--fg` | `#111827` | `#F8FAFC` | 16.9:1 / 18.3:1 |
| `--fg-muted` | `#6B7280` | `#CBD5E1` | 4.83:1 on bg, 4.62:1 on surface / 12.7:1, 11.9:1 |
| `--fg-subtle` | `#6B7280` | `#CBD5E1` | *aliases `--fg-muted`* |

**`--fg-subtle` is an intentional alias, not an oversight.** The system wants three text tiers, but anything dimmer than `#6B7280` fails AA at body size. So the third tier is expressed with **size and weight instead of colour**. Keep the token - call sites depend on it - but know it buys you nothing chromatically.

### 3.3 Borders

| Token | Light | Dark | Contrast | Use |
|---|---|---|---|---|
| `--border` | `#E5E7EB` | `#1E293B` | 1.24:1 light | Decorative hairlines only |
| `--border-strong` | `#6B7280` | `#64748B` | 4.83:1 light | Anything that outlines a control |

**`--border` must never be the only thing identifying an interactive element.** At 1.24:1 it is invisible to many users. That is why `Button variant="secondary"` uses `border-border-strong`, while a `Card` - which is a surface, not a control - uses `border-border`.

### 3.4 Accent

| Token | Light | Dark | Contrast |
|---|---|---|---|
| `--accent` | `#2563EB` | `#3B82F6` | 5.17:1 / 5.12:1 on bg, 4.82:1 on surface |
| `--accent-hover` | `#1D4ED8` | `#60A5FA` | hover state |
| `--accent-strong` | `#1D4ED8` | `#93C5FD` | accent text on an accent tint; 10.4:1 dark |
| `--accent-fg` | `#FFFFFF` | `#0B1120` | 5.17:1 / 5.12:1 |

**`--accent-fg` inverts between themes and this is the single most important detail in the palette.** White on the dark theme's `#3B82F6` is **3.68:1 and fails AA**. So in dark mode the label on a filled accent button flips to near-black (5.12:1).

Consequence: **never write `text-white` on an accent background.** Use `text-primary-foreground`, which resolves to `--accent-fg`.

Note that in light mode `--accent-hover` and `--accent-strong` are the same value; they diverge in dark. Keep using them semantically so a future light-mode change doesn't have to touch call sites.

### 3.5 Status

| Token | Light | Dark | Contrast |
|---|---|---|---|
| `--success` | `#15803D` | `#4ADE80` | 5.02:1 bg / 4.80:1 surface — 10.8:1 / 10.2:1 |

There is no `--warning` or `--danger`. The site has nothing that needs them. Don't add them speculatively.

### 3.6 Scrim

| Token | Light | Dark |
|---|---|---|
| `--scrim` | `#111827` | `#05080F` |

Used with alpha behind modals and drawers. **Dark in both themes** - the previous light value was a light grey, which dimmed nothing.

---

## 4. Typography

### 4.1 Families

| Role | Stack | Package |
|---|---|---|
| `font-sans` | `"Geist Variable", system-ui, sans-serif` | `@fontsource-variable/geist` |
| `font-display` | *same as sans* | — |
| `font-mono` | `"Geist Mono Variable", ui-monospace, monospace` | `@fontsource-variable/geist-mono` |

**One family for headings and body.** `font-display` is retained as an alias so its ~40 call sites stay valid, but it resolves to Geist. Hierarchy comes from size, weight, and spacing - not from a second typeface.

Fonts are self-hosted and imported in `src/main.tsx`. The fontsource entry points declare a `@font-face` per subset with a `unicode-range`, so only the latin file downloads. No external font requests, no FOUT from a CDN.

### 4.2 Scale

Every step is fluid via `clamp()` and **carries its own weight**, so components stop hand-setting `font-bold`.

| Utility | Size (min → max) | Line height | Letter spacing | Weight |
|---|---|---|---|---|
| `text-display` | 32px → 48px | 1.1 | −0.025em | 700 |
| `text-h1` | 30px → 40px | 1.15 | −0.02em | 600 |
| `text-h2` | 24px → 30px | 1.2 | −0.015em | 600 |
| `text-h3` | 18px → 20px | 1.35 | −0.01em | 600 |
| `text-lead` | 17px → 19px | 1.6 | — | inherit |
| `text-body` | 16px | 1.65 | — | 400 |
| `text-eyebrow` | 13px | 1.2 | **+0.12em** | 500 |

Two deliberate details:

- **`display` is capped at 3rem** so the hero still fits above the fold on a scaled laptop display, where the CSS viewport can be as short as ~660px.
- **Negative tracking increases with size.** Large type set at default tracking reads loose; the scale compensates progressively (−0.01em at h3 up to −0.025em at display). The eyebrow goes the other way (+0.12em) because uppercase at 13px needs air.

### 4.3 The heading weight cascade

`globals.css` sets `h1..h4 { font-weight: 700 }` in `@layer base`. The `text-h1`/`text-h2`/`text-h3` utilities set 600 and live in the utilities layer, so **they win**. Net effect:

- A bare `<h2>` renders 700.
- `<h2 className="text-h1">` renders 600 - which is what `SectionHeading` uses.

Section and card titles are 600; only the hero is 700. If you need a 700 heading, use `text-display`.

### 4.4 Long-form prose

`prose-blog` (a `@tailwindcss/typography` variant) is defined in the Tailwind config and mapped to the same tokens, so one definition covers both themes.

| Property | Value |
|---|---|
| Body size / leading | 17px / 1.75 |
| Body colour | `--fg-muted` |
| Headings | `--fg`, weight 600, −0.015em |
| Links | `--accent`, weight 500, underline offset 3px |
| Quote border | `--accent` |
| `pre` background | transparent (the wrapper supplies the surface) |
| Inline code | backtick pseudo-elements removed |

### 4.5 Text rendering

Set globally in `globals.css`:

- `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`
- `text-wrap: balance` on `h1..h4` - stops one-word orphan lines in headings
- `text-wrap: pretty` on `p` - reduces ragged paragraph endings
- `::selection` is accent at 20% alpha with `--fg` text

---

## 5. Spacing & layout

| Metric | Value | Notes |
|---|---|---|
| Container max width | **1200px** | `max-w-container`. `container-wide` is an alias to the same 1200px - the chrome that used 1320px was pulled in. |
| Narrow container | 768px (`max-w-3xl`) | Long-form reading measure |
| Section heading block | 672px (`max-w-2xl`) | Caps eyebrow + title + subtitle |
| Gutters | 20px → 24px (`sm`) → 32px (`lg`) | `px-5 sm:px-6 lg:px-8` |
| Section rhythm | **64px → 112px** | `py-section` = `clamp(4rem, 2.5rem + 4vw, 7rem)` |
| Navbar height | **88px** | `--nav-h` |
| Card padding | 24px | `p-6` |
| Minimum touch target | **44px** | `h-11 w-11`, used consistently for icon buttons |

**`--nav-h` has exactly one definition** and two consumers: CSS `scroll-margin` (via `scroll-mt-[var(--nav-h)]` on every `<Section>`) and `src/utils/scroll.ts`, which parses it for anchored jumps. Change it in one place.

Breakpoints are Tailwind stock (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). No custom breakpoints - the fluid `clamp()` scales absorb most of what custom breakpoints would have handled.

---

## 6. Radius & elevation

### 6.1 Radius - a capped scale

| Utility | Value |
|---|---|
| `rounded-none` | 0 |
| `rounded-sm` | 6px |
| `rounded` | 8px |
| `rounded-md` | 10px |
| `rounded-lg` | 12px |
| `rounded-xl` / `2xl` / `3xl` | **12px** (capped aliases) |
| `rounded-full` | 9999px |

**Everything is 10–12px.** `borderRadius` sits *outside* `extend` on purpose: `extend` merges key-by-key into Tailwind's defaults, which is how an earlier config left stock `2xl` (16px) reachable and *larger* than its own overridden `xl` (28px). Replacing the scale makes the ceiling real.

`rounded-full` is reserved for avatars, the profile portrait, and the status dot. Nothing else.

### 6.2 Shadows

| Utility | Token |
|---|---|
| `shadow-sm` | `--shadow-sm` |
| `shadow` / `shadow-md` | `--shadow-md` |
| `shadow-lg` | `--shadow-lg` |

Like `borderRadius`, `boxShadow` replaces rather than extends - so `shadow-2xl` and friends don't exist.

**Shadows are authored per theme**, because a black shadow on a near-black background is invisible (1.12:1). Dark mode leans on an **inset top highlight** plus the surface step instead:

```css
/* light */ --shadow-md: 0 2px 8px -2px hsl(221 39% 11% / .08), 0 1px 2px 0 hsl(221 39% 11% / .04);
/* dark  */ --shadow-md: 0 2px 8px -2px hsl(223 60% 2% / .5), inset 0 1px 0 0 hsl(210 40% 98% / .04);
```

Elevation in dark mode is therefore communicated by `surface` → `surface-hi` and the hairline, not by cast shadow. Don't expect a dark card to "lift" the way it does in light.

---

## 7. Motion

The entire vocabulary is in `src/animations/variants.ts`. **Four things are allowed:** fade in, slide up, scale to 1.02 on hover, page transitions. Anything more is out of scope by design, not by omission.

| Constant | Value |
|---|---|
| `EASE` | `cubic-bezier(0.16, 1, 0.3, 1)` - the one easing |
| `DUR.fast` | 150ms |
| `DUR.base` | 200ms (Tailwind's default duration too) |
| `DUR.slow` | 300ms |

**Nothing sits outside 150–300ms.** The easing is a gentle deceleration - it reads as intentional rather than springy.

| Variant | Behaviour |
|---|---|
| `fadeIn` | opacity 0 → 1 |
| `fadeInUp` | opacity 0 → 1, y 12 → 0 |
| `slideUp` | y 12 → 0, **opacity pinned at 1** |
| `staggerContainer(0.06)` | 60ms child stagger |
| `interactive` | `hover: scale 1.02`, `tap: scale 0.99` |

**`slideUp` exists for above-the-fold text.** An element animating from `opacity: 0` is not considered painted until the animation finishes, which pushes out LCP. `slideUp` gives the same arrival without the metric cost. Use it in the hero; use `fadeInUp` below the fold.

Standard reveal pattern: `whileInView` with `viewport={{ once: true, amount: 0.5 }}`. Animations play once.

### 7.1 Documented exceptions

- **Marquee** - 36s linear infinite (`--marquee-duration`). The only long animation, and the only reason `keyframes`/`animation` must stay *inside* `extend`: moving them out would delete core utilities like `animate-ping`, which the availability dot uses.
- **Skeleton shimmer** - 1.4s ease-in-out infinite, defined in `globals.css`.

### 7.2 Reduced motion

Two layers, both keyed to the OS setting only:

1. **CSS** - `@media (prefers-reduced-motion: reduce)` collapses all animation and transition durations to `0.01ms` and disables smooth scroll.
2. **JS** - `ReducedMotionProvider` wraps the app in Framer Motion's `<MotionConfig reducedMotion>`.

**There is deliberately no in-app override.** The OS preference is the accessible source of truth. An earlier three-state control defaulted every first-time visitor to "reduced" and could never be returned to "follow system."

**Carve-out:** the blanket CSS rule would freeze the marquee mid-travel, leaving half its content off-screen. So `.animate-marquee` is explicitly reset to `animation: none; transform: none`.

---

## 8. Components

### 8.1 Primitives

| Component | Contract |
|---|---|
| `Container` | Centered, gutter-aware, capped at 1200px. `width="narrow"` gives 768px. |
| `Section` | Landmark wrapper: anchor id, `py-section`, `scroll-mt-[var(--nav-h)]`. `band` adds `border-y` + `bg-surface`. |
| `SectionHeading` | Eyebrow + `text-h1` title + `text-lead` subtitle, revealed with a 60ms stagger. |
| `Card` | `rounded-lg border-border bg-surface p-6 shadow-sm`. `interactive` adds the hover treatment and the `group` scope. |
| `Button` | 3 variants × 3 sizes. |
| `Badge` | 4 tones, `rounded-sm`, 12px, weight 500. |
| `Tag` | Mono tech chip, `rounded-sm`, 12px. |

### 8.2 Button

| Size | Height | Padding | Text |
|---|---|---|---|
| `sm` | 36px | 16px | 14px |
| `md` | 44px | 20px | 14px |
| `lg` | 48px | 24px | 16px |

| Variant | Treatment |
|---|---|
| `primary` | `bg-accent text-primary-foreground shadow-sm`, hover `bg-accent-hover` |
| `secondary` | `border-border-strong bg-surface`, hover border + text to accent |
| `ghost` | `text-muted`, hover `bg-surface` + `text-foreground` |

`md` is 44px - the minimum touch target - which is why it's the default. Renders as `<a>` when `href` is passed, with external links getting `target="_blank"` and `rel="noopener noreferrer"` automatically.

### 8.3 Badge tones

| Tone | Treatment |
|---|---|
| `default` | `border-border bg-surface text-muted` |
| `accent` | `border-accent/25 bg-accent/10 text-accent-strong` |
| `success` | `border-success/25 bg-success/10 text-success` |
| `outline` | `border-border-strong bg-transparent text-foreground` |

The `accent` tone is why `--accent-strong` exists: accent text on a 10% accent tint needs a darker (light) or lighter (dark) step to hold contrast.

### 8.4 CSS component classes

Defined in `globals.css` under `@layer components`:

| Class | Purpose |
|---|---|
| `.panel` | The standard raised surface: `rounded-lg border-border bg-surface shadow-sm`. Replaced the old glassmorphic `.glass`. |
| `.chrome-blur` | `bg-base/80` + `blur(12px)`, with a `@supports not` solid fallback. **Navbar only.** |
| `.eyebrow` | Uppercase 13px `+0.12em` muted label. |
| `.link-underline` | Accent underline wiping in from the left over 200ms, on hover *and* `focus-visible`. |
| `.skeleton` | Surface + shimmer sweep. |

### 8.5 Hover conventions

- **Cards:** `-translate-y-0.5` (2px lift) + border to accent + shadow to `md`
- **Tags / icon buttons:** border to accent, text to foreground
- **Buttons:** `scale(1.02)` via the shared `interactive` spread
- All transitions 200ms with the standard easing

---

## 9. Z-index scale

| Layer | Value |
|---|---|
| In-flow stacking | `z-10`, `z-20` |
| Back-to-top, scroll progress | `z-[90]` |
| Navbar | `z-[95]` |
| Modal | `z-[100]` |
| Skip-to-content | `z-[300]` |

Skip-to-content is highest on purpose - a keyboard user must be able to reach it even with a modal open.

---

## 10. Accessibility standards

**Target: WCAG AA.** Text ≥4.5:1, non-text/UI ≥3:1. Ratios are recorded inline in `tokens.css` where the margin matters.

| Concern | Implementation |
|---|---|
| Focus | `:focus-visible { outline: 2px solid accent; outline-offset: 2px }` |
| Touch targets | 44px minimum (`h-11 w-11`) |
| Skip link | `SkipToContent`, `sr-only` until focused |
| Live regions | `aria-live="polite"` on the testimonial carousel |
| Animated counters | Final value as an `sr-only` sibling, so screen readers don't hear a ticking number |
| Landmarks | Every `<Section>` is a `<section>` with an id, optional `aria-label` |
| Reduced motion | §7.2 |
| Linting | `eslint-plugin-jsx-a11y` |

**Focus uses `outline`, not a box-shadow ring**, for two reasons: it follows each element's own `border-radius` (a previous ring rule forced 6px on everything, squaring off circular buttons and avatars), and it cannot be clobbered by a stray `ring-*` utility.

---

## 11. Code & syntax palette

The sanctioned exception to §1.1. Seven tokens, flipping with `.dark`, every one ≥4.5:1 against `--surface` in both themes. Mapped to highlight.js classes in `code.css`.

| Token | Light | Dark | Ratio (light) | Palette |
|---|---|---|---|---|
| `--code-keyword` | `#7C3AED` | `#C4B5FD` | 5.45:1 | violet 600 / 300 |
| `--code-string` | `#15803D` | `#86EFAC` | 4.80:1 | green 700 / 300 |
| `--code-number` | `#B45309` | `#FCD34D` | 4.81:1 | amber 700 / 300 |
| `--code-comment` | `#64748B` | `#94A3B8` | 4.55:1 | slate 500 / 400 |
| `--code-function` | `#2563EB` | `#93C5FD` | 4.95:1 | blue 600 / 300 |
| `--code-type` | `#0F766E` | `#5EEAD4` | 5.24:1 | teal 700 / 300 |
| `--code-tag` | `#BE123C` | `#FDA4AF` | 6.01:1 | rose 700 / 300 |

Unlike the UI tokens, these carry no hex comments in `tokens.css` - the values above were derived from the channels and matched back to their palette anchors.

Comments are italic. Function titles are weight 600. Variables and properties fall back to `--fg` rather than taking a colour, so the eye isn't fighting seven hues at once.

---

## 12. Hard rules

Violations of these are bugs, not style preferences.

1. **No literal colours in components.** Always a token.
2. **Never `text-white` on accent.** Use `text-primary-foreground` - white fails AA on the dark accent (3.68:1).
3. **Never use `--border` alone to identify a control.** Use `--border-strong` (1.24:1 vs 4.83:1).
4. **Don't move `base`/`canvas` into `colors`.** It breaks `text-base` sitewide (§3.1).
5. **Keep `keyframes`/`animation` inside `extend`.** Moving them out deletes `animate-ping`.
6. **Keep `borderRadius`/`boxShadow` outside `extend`.** Otherwise Tailwind's larger defaults leak back in.
7. **No motion outside 150–300ms**, except the two documented exceptions (§7.1).
8. **No second typeface.** Hierarchy via size, weight, and tracking.
9. **No new accent hue** without moving it into the token layer and re-checking AA in both themes.
10. **44px minimum** for anything tappable.
11. **`--nav-h` stays single-source.** Two consumers, one definition.

---

## 13. Checklist for a new component

- [ ] Colours reference tokens only
- [ ] Renders correctly in light **and** dark - check both, don't assume the token flip handled it
- [ ] Text contrast ≥4.5:1, UI ≥3:1, in both themes
- [ ] Radius from the scale (10–12px, or `rounded-full` if it's an avatar or dot)
- [ ] Type from the scale - don't hand-set `font-size` or `font-weight`
- [ ] Interactive targets ≥44px
- [ ] `:focus-visible` visible and correctly shaped
- [ ] Motion inside 150–300ms using `EASE`; reveal with `once: true`
- [ ] Above-the-fold text uses `slideUp`, not `fadeInUp` (LCP)
- [ ] If it outlines a control, `border-strong` not `border`
- [ ] If it puts text on accent, `text-primary-foreground` not `text-white`
- [ ] Spacing in Tailwind's 4px scale; section-level rhythm via `py-section`

---

## 14. Known compromises

Honest record of where the system bends, so nobody "fixes" one of these into a regression.

| Compromise | Why it stands |
|---|---|
| `--fg-subtle` aliases `--fg-muted` | A genuine third text tier fails AA at body size. Third tier is size/weight instead. |
| `--accent-hover` == `--accent-strong` in light | They diverge in dark. Keep them semantically distinct at call sites. |
| `rounded-xl/2xl/3xl` are lies | They're capped aliases so ~existing call sites keep compiling. Prefer `rounded-lg` in new code. |
| `font-display` == `font-sans` | Alias retained for ~40 call sites. Don't add more. |
| Dark shadows barely register | Physics. Dark elevation uses the surface step + inset highlight instead. |
| Knowledge of ratios lives in comments | There is no automated contrast test. Adding one would be the highest-value improvement to this system. |
