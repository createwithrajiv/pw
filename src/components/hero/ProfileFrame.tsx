import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeInUp } from '@/animations/variants';

interface ProfileFrameProps {
  image: string;
  name: string;
  className?: string;
}

/**
 * The hero portrait: a plain circular image with a soft ring.
 *
 * Intrinsic width/height are set so the browser reserves the box before the
 * image decodes — this is above the fold, so it would otherwise be a visible
 * layout shift.
 */
export function ProfileFrame({ image, name, className }: ProfileFrameProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={cn('relative mx-auto w-full max-w-[14rem] lg:max-w-[16rem]', className)}
    >
      <img
        src={image}
        alt={`Portrait of ${name}`}
        width={256}
        height={256}
        loading="eager"
        // @ts-expect-error — valid HTML attribute, not yet in React's typings
        fetchpriority="high"
        decoding="async"
        draggable={false}
        className="aspect-square h-auto w-full rounded-full border border-border object-cover shadow-sm"
      />
    </motion.div>
  );
}
