import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TagProps {
  className?: string;
  children: ReactNode;
}

/** Small mono tech chip with a subtle hover glow. */
export function Tag({ className, children }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-surface/60 px-2.5 py-1',
        'font-mono text-xs text-muted transition-colors duration-200',
        'hover:border-accent/40 hover:text-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
