import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { useElementScroll } from '@/hooks/useElementScroll';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { SectionDivider } from './SectionDivider';
import { cn } from '@/utils/cn';

type ScrollOffset = Parameters<typeof useElementScroll>[0] extends { offset?: infer O } ? O : never;

interface SectionWipeProps {
  variant?: 'beam' | 'curtain' | 'split';
  className?: string;
}

/** A bold scroll-linked seam wipe. Reduced motion → the static SectionDivider line. */
export function SectionWipe({ variant = 'beam', className }: SectionWipeProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useElementScroll({
    offset: ['start 0.92', 'start 0.4'] as ScrollOffset,
    spring: false,
  });
  const x = useTransform(progress, [0, 1], ['-130%', '130%']);
  const clip = useTransform(progress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 ${clip}% 0)`;
  const grow = useTransform(progress, [0, 1], [0, 1]);

  if (reduced) return <SectionDivider className={className} />;

  if (variant === 'curtain') {
    return (
      <motion.div
        ref={ref}
        aria-hidden
        style={{ clipPath }}
        className={cn('h-12 w-full rounded-full bg-grad-accent/15', className)}
      />
    );
  }

  if (variant === 'split') {
    return (
      <div ref={ref} aria-hidden className={cn('relative h-px w-full', className)}>
        <motion.div
          style={{ scaleX: grow, originX: 0 }}
          className="absolute left-0 top-0 h-full w-1/2 bg-grad-accent shadow-glow"
        />
        <motion.div
          style={{ scaleX: grow, originX: 1 }}
          className="absolute right-0 top-0 h-full w-1/2 bg-grad-accent shadow-glow"
        />
      </div>
    );
  }

  // beam (default)
  return (
    <div ref={ref} aria-hidden className={cn('relative h-px w-full', className)}>
      <div className="absolute inset-0 bg-border/40" />
      <motion.div
        style={{ x }}
        className="absolute -top-3 h-6 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-[3px]"
      />
    </div>
  );
}
