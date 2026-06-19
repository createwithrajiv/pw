import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { blurScaleIn } from '@/animations/variants';

interface ProfileFrameProps {
  image: string;
  name: string;
  /** Gate the reveal on the intro step; falls back to viewport when omitted. */
  play?: boolean;
  className?: string;
}

/**
 * Circular portrait in a glass frame: rotating conic-gradient ring, soft glow
 * halo, cursor tilt/parallax (≤4°), and a shimmer until the image loads.
 */
export function ProfileFrame({ image, name, play, className }: ProfileFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const tilt = usePointerTilt<HTMLDivElement>({ max: 4, parallax: 10 });

  const gate =
    play === undefined
      ? ({ whileInView: 'show', viewport: { once: true, amount: 0.4 } } as const)
      : ({ animate: play ? 'show' : 'hidden' } as const);

  return (
    <motion.div
      ref={tilt.ref}
      variants={blurScaleIn}
      initial="hidden"
      {...gate}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1000 }}
      className={cn(
        'relative mx-auto aspect-square w-full max-w-[18rem] [transform-style:preserve-3d] lg:max-w-[20rem]',
        className,
      )}
    >
      {/* rotating conic gradient ring (masked donut) */}
      <div
        aria-hidden
        className="animate-conic-spin absolute -inset-[3px] rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, hsl(var(--grad-from)), hsl(var(--grad-mid)), hsl(var(--grad-to)), hsl(var(--grad-from)))',
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
        }}
      />

      {/* soft glow halo */}
      <div
        aria-hidden
        className="animate-glow-pulse absolute -inset-6 rounded-full bg-accent/20 blur-[60px]"
      />

      {/* glass disc + portrait (lifted in Z for parallax against the ring) */}
      <div
        className="glass relative h-full w-full overflow-hidden rounded-full"
        style={{ transform: 'translateZ(40px)' }}
      >
        <img
          src={image}
          alt={name}
          loading="eager"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
        {!loaded && <div className="animate-glow-pulse absolute inset-0 bg-surface/60" />}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-b from-foreground/10 to-transparent"
        />
      </div>
    </motion.div>
  );
}
