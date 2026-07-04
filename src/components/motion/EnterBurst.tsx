import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { EASE } from '@/animations/variants';
import { cn } from '@/utils/cn';

type BurstVariant = 'ring' | 'sweep' | 'scatter' | 'ripple';

interface EnterBurstProps {
  variant?: BurstVariant | BurstVariant[];
  threshold?: number;
  className?: string;
  children: ReactNode;
}

const SCATTER = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2;
  return { x: Math.cos(a) * 130, y: Math.sin(a) * 84, d: i * 0.02 };
});

/**
 * One-shot section-entrance hook: a glow shockwave ring / light sweep / particle
 * scatter / grid ripple fires once when the wrapped heading enters view, behind
 * the content. Decorative, reduced-motion → nothing.
 */
export function EnterBurst({ variant = 'ring', threshold = 0.4, className, children }: EnterBurstProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold });
  const variants = Array.isArray(variant) ? variant : [variant];
  const fire = inView && !reduced;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <AnimatePresence>
        {fire && variants.includes('ring') && (
          <motion.span
            key="ring"
            aria-hidden
            initial={{ scale: 0.2, opacity: 0.55 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 0.95, ease: EASE }}
            className="pointer-events-none absolute left-0 top-1 h-24 w-24 rounded-full border border-accent/50"
          />
        )}
        {fire && variants.includes('sweep') && (
          <motion.span
            key="sweep"
            aria-hidden
            initial={{ x: '-130%' }}
            animate={{ x: '130%' }}
            transition={{ duration: 1, ease: EASE, delay: 0.05 }}
            className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent mix-blend-overlay"
          />
        )}
        {fire && variants.includes('ripple') && (
          <motion.span
            key="ripple"
            aria-hidden
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.06, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, ease: EASE }}
            className="grid-overlay pointer-events-none absolute -inset-8"
          />
        )}
        {fire &&
          variants.includes('scatter') &&
          SCATTER.map((s, i) => (
            <motion.span
              key={`sc-${i}`}
              aria-hidden
              initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
              animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.9, ease: EASE, delay: s.d }}
              className="pointer-events-none absolute left-2 top-3 h-1.5 w-1.5 rounded-full bg-accent"
            />
          ))}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
