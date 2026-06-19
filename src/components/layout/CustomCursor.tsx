import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useIsTouch } from '@/hooks/useMediaQuery';
import { useSettings } from '@/hooks/useContent';

/**
 * Custom cursor: a precise dot + a lagging ring that grows over interactive
 * elements. Desktop / fine-pointer only; disabled under reduced motion. Never
 * intercepts events (pointer-events: none).
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const { features } = useSettings();
  const enabled = features.customCursor && !reduced && !isTouch;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('cursor-none');

    let raf = 0;
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          x.set(lx);
          y.set(ly);
        });
      }
    };
    const interactiveSel = 'a, button, [data-cursor], input, textarea, select, [role="tab"]';
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest?.(interactiveSel));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hovering ? 48 : 28,
          height: hovering ? 48 : 28,
          opacity: hovering ? 1 : 0.5,
          backgroundColor: hovering ? 'hsl(var(--accent) / 0.1)' : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
