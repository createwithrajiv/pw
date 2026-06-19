import { useInView } from 'react-intersection-observer';

interface ScrollRevealOptions {
  /** Fraction of the element that must be visible to trigger (0-1). */
  amount?: number;
  /** Fire only once. Default true. */
  once?: boolean;
  rootMargin?: string;
}

/** Thin wrapper over IntersectionObserver for reveal/count-up triggers. */
export function useScrollReveal({
  amount = 0.25,
  once = true,
  rootMargin = '0px 0px -10% 0px',
}: ScrollRevealOptions = {}) {
  const { ref, inView } = useInView({ threshold: amount, triggerOnce: once, rootMargin });
  return { ref, inView };
}
