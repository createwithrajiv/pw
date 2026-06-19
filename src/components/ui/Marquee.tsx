import { Children, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface MarqueeProps {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  reverse?: boolean;
  pauseOnHover?: boolean;
  gap?: string;
  className?: string;
  fade?: boolean;
}

/** Infinite horizontal scroller. Renders a static wrapped row under reduced motion. */
export function Marquee({
  children,
  speed = 36,
  reverse = false,
  pauseOnHover = true,
  gap = '2rem',
  className,
  fade = true,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);

  if (reduced) {
    return (
      <div className={cn('flex flex-wrap justify-center', className)} style={{ gap }}>
        {items}
      </div>
    );
  }

  const copy = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" style={{ gap }} aria-hidden={hidden}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        'group relative flex overflow-hidden',
        fade && '[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max shrink-0 items-center',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ gap, ['--marquee-duration' as string]: `${speed}s` }}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
