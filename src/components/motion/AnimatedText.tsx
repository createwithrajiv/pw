import { Fragment, type ElementType } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { EASE, EMPHASIS_DELAY } from '@/animations/variants';

export interface TextSegment {
  text: string;
  emphasis?: boolean;
}

interface AnimatedTextProps {
  text?: string;
  /** Structured words — emphasized ones get gradient + glow and a later arrival. */
  segments?: TextSegment[];
  split?: 'word' | 'char';
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  /** When provided, the reveal is gated on this flag (intro orchestration) instead of the viewport. */
  play?: boolean;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const fragment: Variants = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
  show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

const emphasisFragment: Variants = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(10px)' },
  show: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay: EMPHASIS_DELAY },
  },
};

const EMPHASIS_CLASS = 'text-gradient font-semibold glow-text';

/**
 * Headline reveal that masks each word and slides it up with a focus-pulling
 * blur. Supports structured `segments` (emphasized words land a beat later with
 * gradient + glow) and an external `play` gate for the hero intro. Renders plain
 * (styled) text under reduced motion and keeps an accessible label.
 */
export function AnimatedText({
  text,
  segments,
  split = 'word',
  as: Tag = 'span',
  className,
  stagger = 0.06,
  delay = 0,
  once = true,
  play,
}: AnimatedTextProps) {
  const reduced = useReducedMotion();
  const tokens: TextSegment[] = segments ?? (text ?? '').split(' ').map((t) => ({ text: t }));
  const label = segments ? segments.map((s) => s.text).join(' ') : (text ?? '');

  if (reduced) {
    return (
      <Tag className={className} aria-label={label}>
        {tokens.map((tk, i) => (
          <Fragment key={i}>
            <span className={cn(tk.emphasis && EMPHASIS_CLASS)}>{tk.text}</span>
            {i < tokens.length - 1 && ' '}
          </Fragment>
        ))}
      </Tag>
    );
  }

  const gate =
    play === undefined
      ? ({ whileInView: 'show', viewport: { once, amount: 0.5 } } as const)
      : ({ animate: play ? 'show' : 'hidden' } as const);

  return (
    <Tag className={cn('inline-block', className)} aria-label={label}>
      <motion.span
        aria-hidden
        variants={container(stagger, delay)}
        initial="hidden"
        {...gate}
        className="inline"
      >
        {tokens.map((tk, wi) => {
          const isChar = split === 'char' && !segments;
          return (
            <Fragment key={wi}>
              <span className="inline-flex overflow-hidden align-bottom">
                {isChar ? (
                  tk.text.split('').map((char, ci) => (
                    <motion.span key={ci} variants={fragment} className="inline-block">
                      {char}
                    </motion.span>
                  ))
                ) : (
                  <motion.span
                    variants={tk.emphasis ? emphasisFragment : fragment}
                    className={cn('inline-block', tk.emphasis && EMPHASIS_CLASS)}
                  >
                    {tk.text}
                  </motion.span>
                )}
              </span>
              {wi < tokens.length - 1 && ' '}
            </Fragment>
          );
        })}
      </motion.span>
    </Tag>
  );
}
