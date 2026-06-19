import { useEffect, useRef } from 'react';
import { useMotionTemplate, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface PointerGlowOptions {
  size?: number; // glow diameter in px
  /** HSL token reference, e.g. "var(--glow-cyan)". */
  colorVar?: string;
  alpha?: number;
}

interface PointerGlowResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  background: MotionValue<string> | string;
  active: boolean;
}

/**
 * A soft radial glow that tracks the cursor inside the referenced element.
 * Built on motion values + useMotionTemplate so it never triggers React
 * re-renders. No-op (static transparent) under reduced motion / coarse pointer.
 */
export function usePointerGlow<T extends HTMLElement = HTMLDivElement>({
  size = 480,
  colorVar = 'var(--glow-cyan)',
  alpha = 0.1,
}: PointerGlowOptions = {}): PointerGlowResult<T> {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);
  const sx = useSpring(x, { stiffness: 150, damping: 25, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 150, damping: 25, mass: 0.3 });
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${sx}px ${sy}px, hsl(${colorVar} / ${alpha}), transparent 60%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      lx = e.clientX - rect.left;
      ly = e.clientY - rect.top;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          x.set(lx);
          y.set(ly);
        });
      }
    };
    const onLeave = () => {
      x.set(-size);
      y.set(-size);
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, size, x, y]);

  if (reduced) return { ref, background: 'transparent', active: false };
  return { ref, background, active: true };
}
