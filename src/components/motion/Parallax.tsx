import { useRef, type ReactNode } from 'react';
import { useParallax } from '@/hooks/useParallax';
import { cn } from '@/utils/cn';

interface ParallaxProps {
  speed?: number; // 0.05–0.25 typical; negative leads the scroll
  axis?: 'y' | 'x';
  className?: string;
  children: ReactNode;
}

/** Declarative scroll-linked depth layer (reuses the GSAP useParallax hook). */
export function Parallax({ speed = 0.12, axis = 'y', className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, { speed, axis });
  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
