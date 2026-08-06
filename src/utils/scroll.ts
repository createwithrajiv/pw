/**
 * Native scroll helpers. Replaces the Lenis-based SmoothScrollProvider: no rAF
 * loop, no scroll hijack, no fight with the trackpad — just `window.scrollTo`
 * plus the sticky-navbar offset that anchored jumps need.
 */

/** Fallback if `--nav-h` can't be read (SSR, or the token is missing). */
const NAV_H_FALLBACK = 88;

/**
 * Height of the sticky navbar, read from the `--nav-h` token so CSS and JS
 * share one source of truth. Only evaluated on an actual scroll call.
 */
function navHeight(): number {
  if (typeof window === 'undefined') return NAV_H_FALLBACK;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : NAV_H_FALLBACK;
}

export type ScrollTarget = string | number | HTMLElement;

export interface ScrollOptions {
  /** Offset in px applied to the resolved position. Defaults to `---nav-h`. */
  offset?: number;
  /** Jump instantly instead of animating. */
  immediate?: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Resolve a selector / element / absolute Y into a document-space Y position. */
function resolveTop(target: ScrollTarget): number | null {
  if (typeof target === 'number') return target;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * Scroll to an element, selector or absolute Y position.
 *
 * Smooth by default; instant when `immediate` is passed or the visitor has
 * asked for reduced motion. A missing selector is a no-op rather than a throw,
 * matching the old provider's behaviour for anchors whose section is disabled.
 */
export function scrollTo(target: ScrollTarget, opts: ScrollOptions = {}): void {
  const base = resolveTop(target);
  if (base === null) return;
  const top = Math.max(0, base + (opts.offset ?? -navHeight()));
  window.scrollTo({
    top,
    behavior: opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth',
  });
}
