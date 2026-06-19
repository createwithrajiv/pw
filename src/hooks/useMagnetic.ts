import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface MagneticOptions {
  strength?: number; // 0-1, how strongly the element follows the cursor
}

/**
 * Magnetic hover: the element drifts toward the cursor while hovered, springing
 * back on leave. Disabled under reduced motion and on coarse-pointer devices.
 * Returns a ref + spring motion values to apply to a motion element's style.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({ strength = 0.35 }: MagneticOptions = {}) {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      lx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      ly = (e.clientY - (rect.top + rect.height / 2)) * strength;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          x.set(lx);
          y.set(ly);
        });
      }
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      x.set(0);
      y.set(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, strength, x, y]);

  return { ref, x: springX, y: springY };
}
