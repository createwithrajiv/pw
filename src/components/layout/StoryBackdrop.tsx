import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

/**
 * Page-level "narrative light": a soft radial glow that descends and shifts hue
 * (cyan → violet → magenta, the dark-palette accent hues) as the user reads.
 * Fixed, behind all content. Static under reduced motion.
 */
export function StoryBackdrop() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const cy = useTransform(p, [0, 1], [14, 88]);
  const hue = useTransform(p, [0, 0.5, 1], [190, 265, 330]);
  const background = useMotionTemplate`radial-gradient(45% 35% at 50% ${cy}vh, hsl(${hue} 90% 60% / 0.13), transparent 70%)`;

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grad-radial opacity-50"
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background }}
    />
  );
}
