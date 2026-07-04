import type { ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import { usePinScrub } from '@/hooks/usePinScrub';
import { cn } from '@/utils/cn';

interface ScrollSceneProps {
  distance?: string | number;
  scrub?: number;
  start?: string;
  /** Applied to the pinned stage (e.g. a 100svh container). */
  className?: string;
  /** Applied instead when not pinned (reduced motion / disabled). */
  fallbackClassName?: string;
  children: (progress: MotionValue<number>, pinned: boolean) => ReactNode;
}

/** Declarative pin+scrub stage. Children read scrub progress via render-prop. */
export function ScrollScene({
  distance = '+=120%',
  scrub = 1,
  start = 'top top',
  className,
  fallbackClassName,
  children,
}: ScrollSceneProps) {
  const { ref, progress, pinned } = usePinScrub<HTMLDivElement>({ distance, scrub, start });
  return (
    <div ref={ref} className={cn(pinned ? className : fallbackClassName)}>
      {children(progress, pinned)}
    </div>
  );
}
