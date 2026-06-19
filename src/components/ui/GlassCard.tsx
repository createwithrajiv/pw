import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  /** Add a hover lift + glow. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/** Glassmorphic surface used for most cards. */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ interactive = false, className, children, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'glass rounded-lg p-6',
        interactive &&
          'group transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  ),
);
GlassCard.displayName = 'GlassCard';
