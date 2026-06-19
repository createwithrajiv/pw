import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface CountUpOptions {
  duration?: number; // ms
  /** Gate: only animate once this is true (e.g. on scroll into view). */
  start?: boolean;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animate a number from 0 → target once `start` is true. */
export function useCountUp(target: number, { duration = 1800, start = true }: CountUpOptions = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    let t0: number | null = null;
    const tick = (now: number) => {
      if (t0 === null) t0 = now;
      const progress = Math.min(1, (now - t0) / duration);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, reduced]);

  return value;
}
