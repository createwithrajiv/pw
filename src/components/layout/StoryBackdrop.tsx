import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useFxSignals } from '@/hooks/useFxSignals';

/**
 * Page-level "narrative light": a soft radial glow that descends and shifts hue
 * (cyan → violet → magenta) as the user reads, plus a counter-glow for depth.
 * Brightens with scroll velocity. Consumes the shared fx signals so the WebGL
 * field and this layer move identically. Static under reduced motion.
 */
export function StoryBackdrop() {
  const fx = useFxSignals();
  const { pathname } = useLocation();
  const cy = useTransform(fx.scrollProgress, [0, 1], [12, 90]);
  const alpha = useTransform(fx.velocityAbs, [0, 1], [0.14, 0.24]);
  const background = useMotionTemplate`radial-gradient(58% 46% at 50% ${cy}vh, hsl(${fx.hue} 90% 60% / ${alpha}), transparent 72%)`;

  const cy2 = useTransform(fx.scrollProgress, [0, 1], [88, 14]);
  const hue2 = useTransform(fx.hue, (h) => h + 80);
  const background2 = useMotionTemplate`radial-gradient(52% 40% at 50% ${cy2}vh, hsl(${hue2} 80% 55% / 0.08), transparent 70%)`;

  // Blog routes read like reduced-motion — a calm static backdrop, no scroll-hue.
  if (fx.reduced || pathname.startsWith('/blogs')) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grad-radial opacity-50" />
    );
  }

  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: background2 }}
      />
    </>
  );
}
