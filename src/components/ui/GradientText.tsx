import type { ElementType, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface GradientTextProps {
  as?: ElementType;
  className?: string;
  animate?: boolean;
  children: ReactNode;
}

/** Cyan→violet gradient text clip. */
export function GradientText({ as: Tag = 'span', className, animate = false, children }: GradientTextProps) {
  return (
    <Tag className={cn('text-gradient', animate && 'animate-gradient-shift', className)}>
      {children}
    </Tag>
  );
}
