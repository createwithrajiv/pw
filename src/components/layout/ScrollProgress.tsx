import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavSections } from '@/hooks/useSections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { scrollTo } from '@/utils/scroll';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

interface Mark {
  id: string;
  anchor: string;
  label: string;
  pos: number; // 0..1 down the page
}

/**
 * Scroll progress: a slim top line on mobile, and on desktop a vertical rail
 * with one tick per section that doubles as quick-nav. Unsprung under reduced
 * motion.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = reduced ? scrollYProgress : spring;

  const navSections = useNavSections();
  const ids = navSections.map((s) => s.anchor.replace('#', ''));
  const active = useActiveSection(ids);
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Sections that aren't on this route resolve to null. Dropping them keeps
      // the rail off non-home routes instead of stacking every tick at 0%.
      setMarks(
        navSections.flatMap((s) => {
          const el = document.getElementById(s.anchor.replace('#', ''));
          if (!el || max <= 0) return [];
          const pos = Math.min(1, Math.max(0, el.offsetTop / max));
          return [{ id: s.id, anchor: s.anchor, label: s.label, pos }];
        }),
      );
    };
    compute();
    const t = window.setTimeout(compute, 600); // re-measure after fonts/layout settle
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('resize', compute);
      clearTimeout(t);
    };
  }, [navSections]);

  return (
    <>
      {/* mobile: slim top line */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[90] h-0.5 origin-left bg-accent lg:hidden"
      />

      {/* desktop: vertical rail + section ticks */}
      {marks.length > 1 && (
        <div className="fixed right-5 top-1/2 z-[90] hidden h-[44vh] w-[3px] -translate-y-1/2 lg:block">
          <div aria-hidden className="absolute inset-0 rounded-full bg-border" />
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-accent"
          />
          {marks.map((m) => (
            // The visible tick is 8px, but the button carries a 24px hit area
            // so it clears the minimum touch-target size.
            <button
              key={m.id}
              onClick={() => scrollTo(m.anchor)}
              aria-label={`Go to ${m.label}`}
              aria-current={active === m.id ? 'true' : undefined}
              style={{ top: `${m.pos * 100}%` }}
              className="group absolute left-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            >
              <span
                aria-hidden
                className={cn(
                  'block h-2 w-2 rounded-full border transition-colors duration-200',
                  active === m.id
                    ? 'border-accent bg-accent'
                    : 'border-border-strong bg-canvas group-hover:border-accent',
                )}
              />
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
