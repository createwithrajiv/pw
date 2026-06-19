import { motion, useTransform } from 'framer-motion';
import { useElementScroll } from '@/hooks/useElementScroll';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

type ScrollOffset = Parameters<typeof useElementScroll>[0] extends { offset?: infer O } ? O : never;

interface SectionDividerProps {
  className?: string;
}

/**
 * Animated seam between sections: a gradient line draws across as the boundary
 * enters view, with a soft glow dot traveling along it. Static line under
 * reduced motion. Decorative (aria-hidden, no pointer events).
 */
export function SectionDivider({ className }: SectionDividerProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useElementScroll({
    offset: ['start 0.95', 'start 0.55'] as ScrollOffset,
    spring: false,
  });
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  const left = useTransform(progress, [0, 1], ['0%', '100%']);
  const dotOpacity = useTransform(progress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  if (reduced) {
    return <div ref={ref} aria-hidden className={cn('h-px w-full bg-border/70', className)} />;
  }

  return (
    <div ref={ref} aria-hidden className={cn('relative h-px w-full', className)}>
      <motion.div style={{ scaleX }} className="absolute inset-0 origin-left bg-grad-accent" />
      <motion.span
        style={{ left, opacity: dotOpacity }}
        className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow"
      />
    </div>
  );
}
