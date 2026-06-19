import { useRef } from 'react';
import { useScroll, useSpring, useMotionValue, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

type ScrollOffset = Parameters<typeof useScroll>[0] extends { offset?: infer O } ? O : never;

interface ElementScrollOptions {
  offset?: ScrollOffset;
  spring?: boolean;
  config?: { stiffness?: number; damping?: number; mass?: number };
}

interface ElementScrollResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  /** 0→1 entrance progress, spring-smoothed. Static 1 under reduced motion. */
  progress: MotionValue<number>;
  /** Unsprung progress (for comet/marker math). Static 1 under reduced motion. */
  rawProgress: MotionValue<number>;
}

/**
 * Ergonomic wrapper over Framer's element `useScroll` with a baked-in spring and
 * the reduced-motion fallback, so scroll-linked sections stop re-deriving it.
 * Under reduced motion both progress values are a static 1 (final state).
 */
export function useElementScroll<T extends HTMLElement = HTMLDivElement>({
  offset = ['start end', 'end start'] as ScrollOffset,
  spring = true,
  config,
}: ElementScrollOptions = {}): ElementScrollResult<T> {
  const reduced = useReducedMotion();
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const sprung = useSpring(scrollYProgress, {
    stiffness: config?.stiffness ?? 120,
    damping: config?.damping ?? 30,
    mass: config?.mass ?? 0.4,
  });
  const staticOne = useMotionValue(1);

  if (reduced) return { ref, progress: staticOne, rawProgress: staticOne };
  return { ref, progress: spring ? sprung : scrollYProgress, rawProgress: scrollYProgress };
}
