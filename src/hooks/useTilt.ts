import { useEffect, useRef } from 'react';
import { useMotionTemplate, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface TiltOptions {
  max?: number; // max rotation in degrees
  scale?: number; // hover scale
}

interface TiltResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  glareX: MotionValue<string>;
  glareY: MotionValue<string>;
  glareOpacity: MotionValue<number>;
}

const SPRING = { stiffness: 160, damping: 26, mass: 0.6 } as const;

/**
 * Pointer-tracked 3D tilt for cards (≤ max°), plus a pointer-tracked glare
 * center for a sheen layer. rAF-batched; disabled under reduced motion / touch.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 3,
  scale = 1.02,
}: TiltOptions = {}): TiltResult<T> {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const opacity = useMotionValue(0);

  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);
  const scaleV = useSpring(s, SPRING);
  const glareX = useMotionTemplate`${gx}%`;
  const glareY = useMotionTemplate`${gy}%`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    let fx = 0.5;
    let fy = 0.5;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      fx = (e.clientX - rect.left) / rect.width;
      fy = (e.clientY - rect.top) / rect.height;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          ry.set((fx - 0.5) * 2 * max);
          rx.set(-(fy - 0.5) * 2 * max);
          gx.set(fx * 100);
          gy.set(fy * 100);
        });
      }
    };
    const onEnter = () => {
      s.set(scale);
      opacity.set(1);
    };
    const onLeave = () => {
      rx.set(0);
      ry.set(0);
      s.set(1);
      gx.set(50);
      gy.set(50);
      opacity.set(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, max, scale, rx, ry, s, gx, gy, opacity]);

  return { ref, rotateX, rotateY, scale: scaleV, glareX, glareY, glareOpacity: opacity };
}
