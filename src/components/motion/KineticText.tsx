import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import { useElementScroll } from '@/hooks/useElementScroll';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';

type ScrollOffset = Parameters<typeof useElementScroll>[0] extends { offset?: infer O } ? O : never;

interface KineticChannels {
  scale?: number;
  skewY?: number;
  rotate?: number;
  blur?: number;
  letterSpacing?: number; // em
}

interface KineticTextProps {
  text: string;
  /** External scroll progress (e.g. from a pinned scene). Omit to self-derive. */
  progress?: MotionValue<number>;
  offset?: ScrollOffset;
  from?: KineticChannels;
  to?: KineticChannels;
  velocity?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
}

/**
 * Oversized display text that SCRUBS scale/skew/rotate/blur/letter-spacing on
 * scroll (optionally + scroll-velocity skew). Distinct from AnimatedText (a
 * one-shot reveal). Renders the literal accessible string; static under reduced
 * motion (useElementScroll resolves progress to 1 → the `to` state).
 */
export function KineticText({
  text,
  progress,
  offset = ['start end', 'end start'] as ScrollOffset,
  from = {},
  to = {},
  velocity = false,
  as: Tag = 'span',
  className,
}: KineticTextProps) {
  const reduced = useReducedMotion();
  const { ref, progress: self } = useElementScroll({ offset });
  const p = progress ?? self;
  const vel = useScrollVelocity({ skew: 4 });

  const scale = useTransform(p, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  const rotate = useTransform(p, [0, 1], [from.rotate ?? 0, to.rotate ?? 0]);
  const baseSkew = useTransform(p, [0, 1], [from.skewY ?? 0, to.skewY ?? 0]);
  const blurPx = useTransform(p, [0, 1], [from.blur ?? 0, to.blur ?? 0]);
  const ls = useTransform(p, [0, 1], [from.letterSpacing ?? 0, to.letterSpacing ?? 0]);
  const velSkew = useTransform(
    [baseSkew, vel.skewY] as MotionValue<number>[],
    ([a, b]: number[]) => a + b,
  );
  const skewY = velocity ? velSkew : baseSkew;
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const letterSpacing = useMotionTemplate`${ls}em`;

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag];
  return (
    <MotionTag
      ref={ref as never}
      style={{ scale, rotate, skewY, filter, letterSpacing, display: 'inline-block' }}
      className={cn(className)}
    >
      {text}
    </MotionTag>
  );
}
