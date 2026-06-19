import type { ReactNode } from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import { useTilt } from '@/hooks/useTilt';
import { GlassCard } from './GlassCard';
import { cn } from '@/utils/cn';

interface TiltCardProps {
  className?: string;
  children: ReactNode;
  max?: number;
}

/**
 * GlassCard + 3D tilt (≤max°) + a pointer-tracked sheen. Degrades to a plain
 * GlassCard under reduced motion / touch (the tilt hook returns neutral values).
 */
export function TiltCard({ className, children, max = 3 }: TiltCardProps) {
  const tilt = useTilt<HTMLDivElement>({ max });
  const sheen = useMotionTemplate`radial-gradient(circle at ${tilt.glareX} ${tilt.glareY}, hsl(var(--glow-cyan) / 0.16), transparent 55%)`;

  return (
    <motion.div
      ref={tilt.ref}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.scale,
        transformPerspective: 900,
      }}
      className="h-full [transform-style:preserve-3d]"
    >
      <GlassCard interactive className={cn('relative overflow-hidden', className)}>
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: sheen, opacity: tilt.glareOpacity }}
        />
        <div className="relative">{children}</div>
      </GlassCard>
    </motion.div>
  );
}
