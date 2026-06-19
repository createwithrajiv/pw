import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { VARIANT_MAP, type VariantName } from '@/animations/variants';
import { cn } from '@/utils/cn';

interface RevealProps {
  variant?: VariantName;
  delay?: number;
  amount?: number;
  once?: boolean;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'article';
  children: ReactNode;
}

/** Declarative reveal-on-scroll wrapper — the 90% case. */
export function Reveal({
  variant = 'fadeInUp',
  delay = 0,
  amount = 0.3,
  once = true,
  className,
  as = 'div',
  children,
}: RevealProps) {
  const MotionTag = motion[as];
  const variants = VARIANT_MAP[variant];
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
