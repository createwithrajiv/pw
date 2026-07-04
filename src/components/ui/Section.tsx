import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { AmbientField } from '@/components/motion/AmbientField';

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
  'aria-label'?: string;
}

/**
 * Per-section landmark wrapper: sets the anchor id, vertical rhythm and the
 * scroll-margin so anchored jumps clear the sticky navbar.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className, children, grid = false, ambient = false, ...rest }, ref) => (
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
      {children}
    </section>
  ),
);
Section.displayName = 'Section';
