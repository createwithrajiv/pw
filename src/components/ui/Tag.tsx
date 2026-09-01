import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TagProps {
  className?: string;
  children: ReactNode;
}

/** Small mono tech chip. */
export function Tag({ className, children }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border bg-surface px-2.5 py-1',
        'font-mono text-xs text-muted transition-colors duration-200',
        'hover:border-accent hover:text-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
