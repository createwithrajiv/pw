import { Marquee } from '@/components/ui/Marquee';
import { cn } from '@/utils/cn';

interface KineticMarqueeProps {
  words: string[];
  reverse?: boolean;
  className?: string;
}

/** Full-bleed band of oversized scrolling words — a kinetic palate-cleanser. */
export function KineticMarquee({ words, reverse = false, className }: KineticMarqueeProps) {
  return (
    <div aria-hidden className={cn('overflow-hidden py-6', className)}>
      <Marquee speed={42} gap="2.5rem" reverse={reverse} fade>
        {words.map((w, i) => (
          <span
            key={i}
            className="select-none font-display text-5xl font-bold uppercase tracking-tight text-foreground/[0.06] sm:text-7xl"
          >
            {w}
            <span className="px-6 text-accent/20">/</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
