import type { ReactNode } from 'react';
import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { useElementScroll } from '@/hooks/useElementScroll';
import { cn } from '@/utils/cn';

type ScrollOffset = Parameters<typeof useElementScroll>[0] extends { offset?: infer O } ? O : never;

interface ScrubRevealProps {
  children: ReactNode;
  offset?: ScrollOffset;
  from?: { y?: number; opacity?: number; clip?: boolean; blur?: number };
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}

/**
 * Scroll-progress-driven reveal — content *scrubs* in as you scroll rather than
 * snapping (distinct from the binary <Reveal>). Final state under reduced motion.
 */
export function ScrubReveal({
  children,
  offset = ['start 0.9', 'start 0.45'] as ScrollOffset,
  from = { y: 40, opacity: 0 },
  className,
  as = 'div',
}: ScrubRevealProps) {
  const { ref, progress } = useElementScroll({ offset });
  const opacity = useTransform(progress, [0, 1], [from.opacity ?? 0, 1]);
  const y = useTransform(progress, [0, 1], [from.y ?? 40, 0]);
  const blurPx = useTransform(progress, [0, 1], [from.blur ?? 0, 0]);
  const clipPct = useTransform(progress, [0, 1], [100, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const clipPath = useMotionTemplate`inset(0 0 ${clipPct}% 0)`;

  const MotionTag = motion[as];
  // MotionValues for filter/clipPath are valid here but not in the static CSS type.
  const style = { opacity, y, ...(from.blur ? { filter } : {}), ...(from.clip ? { clipPath } : {}) } as Record<string, unknown>;

  return (
    <MotionTag ref={ref as never} style={style as never} className={cn(className)}>
      {children}
    </MotionTag>
  );
}
