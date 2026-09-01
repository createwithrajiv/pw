import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  /** Adds the hover treatment and the `group` scope its children rely on. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/** The standard surface: solid background, one hairline border, subtle shadow. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className, children, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-lg border border-border bg-surface p-6 shadow-sm',
        interactive &&
          'group transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  ),
);
Card.displayName = 'Card';
