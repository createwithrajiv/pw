import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'default' | 'accent' | 'success' | 'outline';

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  default: 'bg-surface text-muted border-border',
  accent: 'bg-accent/10 text-accent border-accent/25',
  success: 'bg-success/10 text-success border-success/25',
  outline: 'bg-transparent text-foreground border-border-strong',
};

export function Badge({ tone = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
