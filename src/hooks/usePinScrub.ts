import { useEffect, useRef } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

gsap.registerPlugin(ScrollTrigger);

interface PinScrubOptions {
  distance?: number | string; // pin length, e.g. '+=130%'
  scrub?: number | boolean; // default 1 (1s smoothing — premium feel)
  anticipatePin?: number;
  start?: string;
  pinSpacing?: boolean;
  enabled?: boolean;
}

interface PinScrubResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  /** 0→1 across the pin. STATIC 1 under reduced motion / disabled. */
  progress: MotionValue<number>;
  pinned: boolean;
}

/**
 * GSAP ScrollTrigger pin+scrub exposed as a Framer MotionValue, so a section
 * can drive any number of useTransform chains off one scrub (no GSAP tweens in
 * the section). Lenis-synced via the existing SmoothScrollProvider. Reduced
 * motion → no pin, progress stuck at 1 (final readable state).
 */
export function usePinScrub<T extends HTMLElement = HTMLDivElement>({
  distance = '+=120%',
  scrub = 1,
  anticipatePin = 1,
  start = 'top top',
  pinSpacing = true,
  enabled = true,
}: PinScrubOptions = {}): PinScrubResult<T> {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const active = enabled && !reduced;
  const progress = useMotionValue(active ? 0 : 1);

  useEffect(() => {
    if (!active) {
      progress.set(1);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        end: typeof distance === 'number' ? `+=${distance}` : distance,
        pin: true,
        pinSpacing,
        scrub,
        anticipatePin,
        invalidateOnRefresh: true,
        onUpdate: (self) => progress.set(self.progress),
      });
    }, ref);
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [active, distance, scrub, anticipatePin, start, pinSpacing, progress]);

  return { ref, progress, pinned: active };
}
