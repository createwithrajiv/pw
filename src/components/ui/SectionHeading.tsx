import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import { EnterBurst } from '@/components/motion/EnterBurst';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

type BurstVariant = 'ring' | 'sweep' | 'scatter' | 'ripple';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  /** Section-entrance shockwave behind the heading. `false` disables it. */
  burst?: BurstVariant | BurstVariant[] | false;
}

/** Eyebrow + title + subtitle block with a reveal-on-enter stagger + shockwave. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  burst = ['ring', 'sweep'],
}: SectionHeadingProps) {
  const reduced = useReducedMotion();
  const inner = (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        'max-w-2xl',
        align === 'center' && 'mx-auto',
        className,
      )}
    >
      {eyebrow && (
        <motion.span variants={fadeInUp} className="eyebrow flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2 variants={fadeInUp} className="text-h1 font-display font-semibold tracking-tight">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeInUp} className="text-lead text-muted">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );

  const content = !burst ? (
    inner
  ) : (
    <EnterBurst variant={burst} className={cn('w-fit', align === 'center' && 'mx-auto')}>
      {inner}
    </EnterBurst>
  );

  // Swing the heading block up out of depth as it enters — 3D on real DOM.
  return (
    <motion.div
      initial={reduced ? false : { rotateX: 24, opacity: 0 }}
      whileInView={reduced ? undefined : { rotateX: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      style={reduced ? undefined : { transformPerspective: 1400, transformOrigin: 'center bottom' }}
    >
      {content}
    </motion.div>
  );
}
