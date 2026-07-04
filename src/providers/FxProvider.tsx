import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

export type FxTier = 'full' | 'lite' | 'off';

export interface FxSignals {
  /** 0→1 page scroll progress (spring-smoothed). */
  scrollProgress: MotionValue<number>;
  /** -1..1 smoothed scroll velocity. */
  velocity: MotionValue<number>;
  /** 0..1 |velocity| — "intensity". */
  velocityAbs: MotionValue<number>;
  /** 190→265→330 hue ramp (cyan→violet→magenta) from scroll progress. */
  hue: MotionValue<number>;
  /** Normalized cursor -1..1 (spring-smoothed). */
  mouse: { x: MotionValue<number>; y: MotionValue<number> };
  reduced: boolean;
  tier: FxTier;
}

const FxContext = createContext<FxSignals | null>(null);

function resolveTier(reduced: boolean): FxTier {
  if (reduced) return 'off';
  if (typeof window === 'undefined') return 'lite';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const smallHiDpi = window.innerWidth < 768 && window.devicePixelRatio > 2.5;
  if (coarse || reducedData || lowCores || smallHiDpi) return 'lite';
  return 'full';
}

/**
 * Single shared signal bus for the ambient/interactive fx layer: scroll
 * progress, scroll velocity, a cyan→violet→magenta hue ramp, and the normalized
 * cursor — computed ONCE so every fx hook stays in lockstep (and we never spin
 * up redundant listeners). Exposes a perf `tier` (off | lite | full).
 */
export function FxProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [tier, setTier] = useState<FxTier>(() => resolveTier(reduced));

  useEffect(() => {
    setTier(resolveTier(reduced));
    const onResize = () => setTier(resolveTier(reduced));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [reduced]);

  const { scrollYProgress, scrollY } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const rawVel = useVelocity(scrollY);
  const velSpring = useSpring(rawVel, { stiffness: 300, damping: 50, mass: 0.4 });
  const velocity = useTransform(velSpring, [-2500, 0, 2500], [-1, 0, 1], { clamp: true });
  const velocityAbs = useTransform(velocity, (v) => Math.abs(v));
  const hue = useTransform(scrollProgress, [0, 0.5, 1], [190, 265, 330]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 25, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 25, mass: 0.4 });

  useEffect(() => {
    if (tier !== 'full') return;
    let raf = 0;
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      lx = (e.clientX / window.innerWidth) * 2 - 1;
      ly = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          mx.set(lx);
          my.set(ly);
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [tier, mx, my]);

  // Decorative per-section accent shift (brand --accent for text stays fixed).
  const lastHue = useRef(-1);
  useMotionValueEvent(hue, 'change', (h) => {
    if (reduced) return;
    const rounded = Math.round(h);
    if (rounded === lastHue.current) return;
    lastHue.current = rounded;
    document.documentElement.style.setProperty('--accent-live', `${rounded} 90% 60%`);
  });

  const value = useMemo<FxSignals>(
    () => ({
      scrollProgress,
      velocity,
      velocityAbs,
      hue,
      mouse: { x: sx, y: sy },
      reduced,
      tier,
    }),
    [scrollProgress, velocity, velocityAbs, hue, sx, sy, reduced, tier],
  );

  return <FxContext.Provider value={value}>{children}</FxContext.Provider>;
}

export function useFxSignals(): FxSignals {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error('useFxSignals must be used within FxProvider');
  return ctx;
}
