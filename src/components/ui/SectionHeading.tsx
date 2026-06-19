import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeInUp, staggerContainer } from '@/animations/variants';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Eyebrow + title + subtitle block with a reveal-on-enter stagger. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
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
}
