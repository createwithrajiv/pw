import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
}

/** Accessible tablist with an animated active indicator. */
export function Tabs({ tabs, active, onChange, layoutId = 'tab-indicator', className }: TabsProps) {
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn('no-scrollbar flex gap-2 overflow-x-auto', className)}
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, i)}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative shrink-0 whitespace-nowrap rounded-pill px-4 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-primary-foreground' : 'text-muted hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-pill bg-grad-accent shadow-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
