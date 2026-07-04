import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';
import { EASE_IN_OUT } from '@/animations/variants';
import { settings } from '@/data';

const KEY = 'page-curtain-played';

/**
 * Page-load cinematic reveal: two panels split apart with a light-seam sweep,
 * once per session. Reduced motion / repeat visit → renders nothing (instant).
 */
export function RevealCurtain() {
  const reduced = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined' || reduced) return false;
    return sessionStorage.getItem(KEY) !== '1';
  });

  useEffect(() => {
    if (!show) return;
    stop();
    const t = window.setTimeout(() => {
      sessionStorage.setItem(KEY, '1');
      setShow(false);
      start();
    }, 1600);
    return () => {
      window.clearTimeout(t);
      start();
    };
  }, [show, stop, start]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[200]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-base"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: EASE_IN_OUT, delay: 0.65 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-base"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.85, ease: EASE_IN_OUT, delay: 0.65 }}
          />
          <motion.span
            className="text-gradient absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-6xl font-bold"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: [0, 1, 1, 0], scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, times: [0, 0.25, 0.6, 0.9], ease: EASE_IN_OUT }}
          >
            {settings.brandShortName}
          </motion.span>
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px origin-center -translate-y-1/2 bg-grad-accent shadow-glow-lg"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.6, 0] }}
            transition={{ duration: 1.4, ease: EASE_IN_OUT }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
