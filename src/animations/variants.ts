import type { Variants } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1] as const; // out-expo-ish
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const DUR = { fast: 0.3, base: 0.6, slow: 0.9 } as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: DUR.slow, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Opacity-only variants used when reduced motion is requested. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

/** Clip-path wipe — content "arrives" from a clean edge rather than fading. */
export const clipReveal: Variants = {
  hidden: { opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: DUR.slow, ease: EASE },
  },
};

/** Blur + subtle scale settle — for glass cards / fact sheets. */
export const blurScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DUR.slow, ease: EASE },
  },
};

/** Heavier, slower rise for primary content (lead paragraphs / headlines). */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE } },
};

/** Shared low-bounce spring — tilt, nav pill, velocity output all tune here. */
export const arriveSpring = { type: 'spring', stiffness: 160, damping: 26, mass: 0.6 } as const;

/** Alias used by the per-section "signature" surprises (central tuning point). */
export const signatureSpring = arriveSpring;

/** The one global micro-interaction standard (spread onto motion elements). */
export const interactive = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: arriveSpring,
} as const;

/** Delay (s) applied to emphasized words so the eye lands on them a beat later. */
export const EMPHASIS_DELAY = 0.12;

/* ---- Multi-vector entrances (FlyIn / Burst) ---- */
export type FlyDir = 'left' | 'right' | 'up' | 'down' | 'tl' | 'tr' | 'bl' | 'br';

const DIR_VECTORS: Record<FlyDir, { x: number; y: number; rot: number }> = {
  left: { x: -1, y: 0, rot: -1 },
  right: { x: 1, y: 0, rot: 1 },
  up: { x: 0, y: -1, rot: 0 },
  down: { x: 0, y: 1, rot: 0 },
  tl: { x: -1, y: -1, rot: -1 },
  tr: { x: 1, y: -1, rot: 1 },
  bl: { x: -1, y: 1, rot: -1 },
  br: { x: 1, y: 1, rot: 1 },
};

interface FlyInOpts {
  distance?: number;
  rotate?: number;
  blur?: number;
  scale?: number;
  duration?: number;
}

/** A multi-vector entrance variant: fly from a direction + rotate + blur + scale, all at once. */
export function flyIn(dir: FlyDir = 'up', opts: FlyInOpts = {}): Variants {
  const { distance = 64, rotate = 6, blur = 10, scale = 0.92, duration = DUR.slow } = opts;
  const v = DIR_VECTORS[dir];
  return {
    hidden: {
      opacity: 0,
      x: v.x * distance,
      y: v.y * distance,
      rotate: v.rot * rotate,
      scale,
      filter: `blur(${blur}px)`,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration, ease: EASE },
    },
  };
}

/** Rotating direction ring so a grid visibly assembles from many sides at once. */
export const BURST_RING: FlyDir[] = ['bl', 'br', 'tl', 'tr', 'left', 'right', 'up', 'down'];

/** Per-index multi-vector entrance variant (reduced motion → opacity-only). */
export function burstVariant(i: number, reduced: boolean, opts?: { blur?: number }): Variants {
  if (reduced) return reducedFade;
  return flyIn(BURST_RING[i % BURST_RING.length], { blur: opts?.blur ?? 8 });
}

export const VARIANT_MAP = {
  fadeInUp,
  fadeIn,
  blurIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  clipReveal,
  blurScaleIn,
  riseIn,
} as const;

export type VariantName = keyof typeof VARIANT_MAP;
