import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface PointerTiltOptions {
  max?: number; // max rotation in degrees
  parallax?: number; // max translate in px
  radius?: number; // px from center that maps to full deflection
}

interface PointerTiltResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  tx: MotionValue<number>;
  ty: MotionValue<number>;
}

const SPRING = { stiffness: 120, damping: 20 } as const;

/**
 * Cursor parallax/tilt: the referenced element leans toward the pointer as it
 * moves across the viewport (window-level), with matching translate values for
 * layering depth. No-op under reduced motion / coarse pointer.
 */
export function usePointerTilt<T extends HTMLElement = HTMLDivElement>({
  max = 3,
  parallax = 12,
  radius,
}: PointerTiltOptions = {}): PointerTiltResult<T> {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);
  const tx = useSpring(px, SPRING);
  const ty = useSpring(py, SPRING);

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ecx = rect.left + rect.width / 2;
      const ecy = rect.top + rect.height / 2;
      const R = radius ?? Math.max(window.innerWidth, window.innerHeight) / 2;
      cx = Math.max(-1, Math.min(1, (e.clientX - ecx) / R));
      cy = Math.max(-1, Math.min(1, (e.clientY - ecy) / R));
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          ry.set(cx * max);
          rx.set(-cy * max);
          px.set(cx * parallax);
          py.set(cy * parallax);
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, max, parallax, radius, rx, ry, px, py]);

  return { ref, rotateX, rotateY, tx, ty };
}
