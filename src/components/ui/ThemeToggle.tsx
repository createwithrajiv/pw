import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/utils/cn';
import type { ThemeMode } from '@/types';

interface ThemeToggleProps {
  className?: string;
}

const ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NEXT: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const LABEL: Record<ThemeMode, string> = {
  light: 'light',
  dark: 'dark',
  system: 'system',
};

/** Three-state theme control: light -> dark -> follow system. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, cycle } = useTheme();
  const Icon = ICONS[mode];

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${LABEL[mode]}. Switch to ${LABEL[NEXT[mode]]}.`}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-md border border-border bg-surface text-foreground transition-colors duration-200 hover:border-accent hover:text-accent',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          className="absolute"
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
