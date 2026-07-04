import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { flyIn, reducedFade, staggerContainer, BURST_RING, type FlyDir } from '@/animations/variants';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

interface FlyInProps {
  direction?: FlyDir;
  distance?: number;
  rotate?: number;
  blur?: number;
  scale?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: 'div' | 'li' | 'article' | 'span';
  /** Only provide variants — let a parent <Burst> stagger drive show/hidden. */
  asChild?: boolean;
  className?: string;
  children: ReactNode;
}

/** Multi-vector cinematic entrance (fly + rotate + blur + scale, simultaneously). */
export function FlyIn({
  direction = 'up',
  distance,
  rotate,
  blur,
  scale,
  delay = 0,
  once = true,
  amount = 0.3,
  as = 'div',
  asChild = false,
  className,
  children,
}: FlyInProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];
  const variants = reduced ? reducedFade : flyIn(direction, { distance, rotate, blur, scale });
  const driven = asChild
    ? { variants }
    : ({
        variants,
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once, amount },
        transition: { delay },
      } as const);
  return (
    <MotionTag {...driven} className={cn(className)}>
      {children}
    </MotionTag>
  );
}

interface BurstProps {
  as?: 'div' | 'ul';
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Container that staggers its children's entrance. Pair with `<FlyIn asChild
 * direction={BURST_RING[i % BURST_RING.length]}>` children so a grid assembles
 * from many vectors at once.
 */
export function Burst({
  as = 'div',
  stagger = 0.07,
  delay = 0,
  amount = 0.2,
  once = true,
  className,
  children,
}: BurstProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

/** Direction for the i-th burst child (cycles the ring). */
export const burstDir = (i: number): FlyDir => BURST_RING[i % BURST_RING.length];
