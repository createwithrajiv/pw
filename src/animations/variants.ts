import type { Variants } from 'framer-motion';

/**
 * The site's entire motion vocabulary.
 *
 * The design system allows exactly four things: fade in, slide up, scale to
 * 1.02 on hover, and page transitions — all between 150ms and 300ms. Anything
 * that needs more than this is out of scope by design, not by omission.
 */

/** The one easing. Gentle deceleration; reads as intentional rather than springy. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Durations, in seconds. Nothing outside the 150–300ms window. */
export const DUR = { fast: 0.15, base: 0.2, slow: 0.3 } as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.slow, ease: EASE } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE } },
};

/**
 * Slide up with opacity pinned at 1.
 *
 * For above-the-fold text: an element that animates from `opacity: 0` is not
 * considered painted until the animation ends, which pushes out LCP. This gives
 * the same arrival without that cost.
 */
export const slideUp: Variants = {
  hidden: { y: 12 },
  show: { y: 0, transition: { duration: DUR.slow, ease: EASE } },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** The one global micro-interaction (spread onto motion elements). */
export const interactive = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.99 },
  transition: { duration: DUR.base, ease: EASE },
} as const;

export const VARIANT_MAP = { fadeIn, fadeInUp, slideUp } as const;

export type VariantName = keyof typeof VARIANT_MAP;
