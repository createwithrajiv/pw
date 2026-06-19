import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number; // positive moves slower than scroll (depth)
  axis?: 'y' | 'x';
}

/** Scroll-linked parallax translate on the referenced element (transform only). */
export function useParallax(
  ref: RefObject<HTMLElement>,
  { speed = 0.2, axis = 'y' }: ParallaxOptions = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const prop = axis === 'y' ? 'yPercent' : 'xPercent';
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [prop]: -speed * 100 },
        {
          [prop]: speed * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, [ref, speed, axis, reduced]);
}
