import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { EASE } from '@/animations/variants';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /** Draw an accent edge-bar down the answer as it opens. */
  accent?: boolean;
}

/** Single-open accordion with animated height + chevron. */
export function Accordion({ items, className, accent = false }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `accordion-panel-${i}`;
        const buttonId = `accordion-button-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
              >
                <span className="text-h3 font-display font-medium">{item.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted transition-transform duration-300',
                    isOpen && 'rotate-180 text-accent',
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    {accent && (
                      <motion.span
                        aria-hidden
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                        className="absolute bottom-5 left-0 top-0 w-0.5 origin-top rounded-full bg-grad-accent"
                      />
                    )}
                    <p className={cn('pb-5 pr-10 text-body text-muted', accent && 'pl-5')}>
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
