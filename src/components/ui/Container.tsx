import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  as?: ElementType;
  width?: 'default' | 'wide' | 'narrow';
  className?: string;
  children: ReactNode;
}

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-container',
  wide: 'max-w-container',
};

/** Centered, responsive, ultrawide-capped content wrapper. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Tag = 'div', width = 'default', className, children }, ref) => (
    <Tag ref={ref} className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', widths[width], className)}>
      {children}
    </Tag>
  ),
);
Container.displayName = 'Container';
