import { Sparkles, Pause } from 'lucide-react';
import { useMotionPreference } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

/** In-UI toggle so users can force reduced motion even without the OS flag. */
export function MotionToggle() {
  const { reduced, toggle } = useMotionPreference();
  const Icon = reduced ? Pause : Sparkles;
  return (
    <button
      onClick={toggle}
      aria-pressed={reduced}
      className={cn(
        'inline-flex items-center gap-2 self-start rounded-pill border border-border bg-surface/60 px-3 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {reduced ? 'Motion: reduced' : 'Motion: full'}
    </button>
  );
}
