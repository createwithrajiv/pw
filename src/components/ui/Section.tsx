import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  /**
   * Tint the section with the surface colour and hairline rules.
   *
   * Alternating bands are the page's structural device — they give a long,
   * content-first page visible chapters at zero performance and motion cost.
   */
  band?: boolean;
  'aria-label'?: string;
}

/**
 * Per-section landmark wrapper: sets the anchor id, the vertical rhythm, and
 * the scroll margin that keeps anchored jumps clear of the sticky navbar.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className, children, band = false, ...rest }, ref) => (
    <section
      ref={ref}
      id={id}
      className={cn(
        'relative w-full scroll-mt-[var(--nav-h)] py-section',
        band && 'border-y border-border bg-surface',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  ),
);
Section.displayName = 'Section';
