import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { VARIANT_MAP, type VariantName } from '@/animations/variants';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

interface SectionRevealProps {
  variant?: VariantName;
  /** Add a subtle scroll-velocity skew so content leans into fast scrolls. */
  velocity?: boolean;
  delay?: number;
  amount?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'li';
  className?: string;
  children: ReactNode;
}

/**
 * Richer "arrive" wrapper than <Reveal>: a chosen variant plus an optional
 * scroll-velocity lean (rests at 0 when idle). Opt-in for hero blocks / section
 * headers; the plain <Reveal> remains the 90% case.
 */
export function SectionReveal({
  variant = 'riseIn',
  velocity = true,
  delay = 0,
  amount = 0.3,
  once = true,
  as = 'div',
  className,
  children,
}: SectionRevealProps) {
  const reduced = useReducedMotion();
  const { skewY } = useScrollVelocity();
  const MotionTag = motion[as];
  const style = velocity && !reduced ? { skewY } : undefined;

  return (
    <MotionTag
      variants={VARIANT_MAP[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
      style={style}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
