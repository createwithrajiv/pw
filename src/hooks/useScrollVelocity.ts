import {
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface ScrollVelocityOptions {
  skew?: number; // max skew degrees
  scale?: number; // max scale delta
}

/**
 * Maps scroll velocity to a damped skew/scale signal so content can subtly
 * "lean into" fast scrolls and settle when the user stops. Static under reduced
 * motion (skewY rests at 0, scale at 1).
 */
export function useScrollVelocity({ skew = 3, scale = 0.01 }: ScrollVelocityOptions = {}): {
  skewY: MotionValue<number>;
  scale: MotionValue<number>;
} {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50, mass: 0.4 });
  const skewY = useTransform(smooth, [-2000, 0, 2000], [-skew, 0, skew], { clamp: true });
  const scaleV = useTransform(smooth, [-2000, 0, 2000], [1 + scale, 1, 1 - scale], { clamp: true });

  const zero = useMotionValue(0);
  const one = useMotionValue(1);

  if (reduced) return { skewY: zero, scale: one };
  return { skewY, scale: scaleV };
}
