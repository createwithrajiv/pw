import { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useIsTouch } from '@/hooks/useMediaQuery';
import { useSettings } from '@/hooks/useContent';

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, [role="tab"]';

/**
 * Living cursor: a precise dot, a lagging morphing blob with a contextual label
 * (VIEW / DRAG / OPEN from `data-cursor-label`), trailing motes, and a soft
 * full-screen light that follows the pointer. Desktop/fine-pointer only;
 * disabled under reduced motion. Never intercepts events.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const { features } = useSettings();
  const enabled = features.customCursor && !reduced && !isTouch;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const bx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const by = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });
  const m1x = useSpring(x, { stiffness: 220, damping: 26 });
  const m1y = useSpring(y, { stiffness: 220, damping: 26 });
  const m2x = useSpring(x, { stiffness: 150, damping: 24 });
  const m2y = useSpring(y, { stiffness: 150, damping: 24 });
  const m3x = useSpring(x, { stiffness: 90, damping: 22 });
  const m3y = useSpring(y, { stiffness: 90, damping: 22 });
  const lx = useSpring(x, { stiffness: 120, damping: 30 });
  const ly = useSpring(y, { stiffness: 120, damping: 30 });
  const light = useMotionTemplate`radial-gradient(340px circle at ${lx}px ${ly}px, hsl(var(--glow-cyan) / 0.05), transparent 60%)`;

  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('cursor-none');
    let raf = 0;
    let lpx = 0;
    let lpy = 0;
    const onMove = (e: PointerEvent) => {
      lpx = e.clientX;
      lpy = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          x.set(lpx);
          y.set(lpy);
        });
      }
    };
    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.(INTERACTIVE) as HTMLElement | null;
      setActive(!!el);
      setLabel(el?.getAttribute('data-cursor-label') ?? '');
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

  const moteCls =
    'pointer-events-none fixed left-0 top-0 z-[150] h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full';

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[140] mix-blend-screen"
        style={{ background: light }}
      />
      <motion.span aria-hidden className={`${moteCls} bg-accent/60`} style={{ x: m1x, y: m1y }} />
      <motion.span aria-hidden className={`${moteCls} bg-accent/40`} style={{ x: m2x, y: m2y }} />
      <motion.span aria-hidden className={`${moteCls} bg-accent/25`} style={{ x: m3x, y: m3y }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150]"
        style={{ x: bx, y: by }}
      >
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center border border-accent/60 font-mono text-[10px] uppercase tracking-widest text-accent"
          animate={{
            width: active ? (label ? 60 : 46) : 28,
            height: active ? (label ? 30 : 46) : 28,
            borderRadius: label ? 10 : 999,
            opacity: active ? 1 : 0.5,
            backgroundColor: active ? 'hsl(var(--accent) / 0.08)' : 'rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.div>
      </motion.div>
    </>
  );
}
