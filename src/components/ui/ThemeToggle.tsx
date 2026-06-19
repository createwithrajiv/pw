import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

/** Dark/light toggle with an icon cross-fade. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolved, cycle } = useTheme();
  const isDark = resolved === 'dark';

  return (
    <button
      onClick={cycle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'relative grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface/60 text-foreground transition-colors hover:border-accent/50 hover:text-accent',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: -12, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 12, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
