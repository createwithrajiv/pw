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
      setMarks(
        navSections.map((s) => {
          const el = document.getElementById(s.anchor.replace('#', ''));
          const pos = el && max > 0 ? Math.min(1, Math.max(0, el.offsetTop / max)) : 0;
          return { id: s.id, anchor: s.anchor, label: s.label, pos };
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

      {/* desktop: vertical beam + ticks */}
      <div className="fixed right-5 top-1/2 z-[90] hidden h-[44vh] w-[3px] -translate-y-1/2 lg:block">
        <div aria-hidden className="absolute inset-0 rounded-full bg-border/60" />
        <motion.div
          aria-hidden
          style={{ scaleY: progress }}
          className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-accent shadow-sm"
        />
        {marks.map((m) => (
          <button
            key={m.id}
            onClick={() => scrollTo(m.anchor)}
            aria-label={`Go to ${m.label}`}
            style={{ top: `${m.pos * 100}%` }}
            className={cn(
              'group absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300',
              active === m.id
                ? 'scale-125 border-accent bg-accent shadow-sm'
                : 'border-border-strong bg-canvas hover:border-accent',
            )}
          >
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
