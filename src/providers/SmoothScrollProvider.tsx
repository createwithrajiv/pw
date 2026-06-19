import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useSettings } from '@/hooks/useContent';
import { animations } from '@/data';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTarget {
  target: string | number | HTMLElement;
  offset?: number;
  immediate?: boolean;
}

interface SmoothScrollContextValue {
  lenisRef: React.MutableRefObject<Lenis | null>;
  scrollTo: (t: ScrollTarget['target'], opts?: Omit<ScrollTarget, 'target'>) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

/** Height of the sticky navbar — anchored scrolls offset by this. */
const NAV_OFFSET = -88;

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const settings = useSettings();
  const enabled = settings.features.smoothScroll && !reduced;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: animations.scroll.duration,
      lerp: animations.scroll.lerp,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  const value = useMemo<SmoothScrollContextValue>(() => {
    const resolveTarget = (t: ScrollTarget['target']): HTMLElement | number | null => {
      if (typeof t === 'number') return t;
      if (typeof t === 'string') return document.querySelector<HTMLElement>(t);
      return t;
    };

    return {
      lenisRef,
      scrollTo: (t, opts) => {
        const offset = opts?.offset ?? NAV_OFFSET;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(t as never, { offset, immediate: opts?.immediate });
          return;
        }
        // Reduced-motion / Lenis-off fallback.
        const el = resolveTarget(t);
        if (typeof el === 'number') {
          window.scrollTo({ top: el + offset, behavior: 'auto' });
        } else if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'auto' });
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    };
  }, []);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error('useSmoothScroll must be used within SmoothScrollProvider');
  return ctx;
}
