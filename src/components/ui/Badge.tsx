import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'default' | 'accent' | 'success' | 'outline';

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  default: 'border-border bg-surface text-muted',
  accent: 'border-accent/25 bg-accent/10 text-accent-strong',
  success: 'border-success/25 bg-success/10 text-success',
  outline: 'border-border-strong bg-transparent text-foreground',
};

export function Badge({ tone = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
