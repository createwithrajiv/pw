import { forwardRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AmbientField } from '@/components/motion/AmbientField';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface AmbientConfig {
  density?: 'sparse' | 'normal';
  motes?: boolean;
  parallax?: number;
}

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  /** Render the masked animated grid backdrop behind the section. */
  grid?: boolean;
  /** Render drifting ambient particles behind the section. */
  ambient?: boolean | AmbientConfig;
  /**
   * Fly the content FORWARD out of depth as it enters (the "going inside"
   * arrival) instead of rising from the bottom. Off for sections with their own
   * bespoke motion (e.g. the hero).
   */
  depth?: boolean;
  'aria-label'?: string;
}

/**
 * Per-section landmark wrapper: sets the anchor id, vertical rhythm and the
 * scroll-margin so anchored jumps clear the sticky navbar. Content arrives by
 * flying toward the viewer from the depth, reinforcing the sense of travelling
 * inward as you scroll.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className, children, grid = false, ambient = false, depth = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    const arrive = depth && !reduced;
    return (
      <section
        ref={ref}
        id={id}
        style={{ scrollMarginTop: '88px' }}
        className={cn('relative w-full py-section', className)}
        {...rest}
      >
        {grid && (
          <div className="pointer-events-none absolute inset-0 -z-10 grid-overlay" aria-hidden />
        )}
        {ambient && <AmbientField {...(typeof ambient === 'object' ? ambient : {})} />}
        {arrive ? (
          <motion.div
            initial={{ opacity: 0, z: -340 }}
            whileInView={{ opacity: 1, z: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1000 }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </section>
    );
  },
);
Section.displayName = 'Section';
