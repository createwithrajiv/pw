import { motion } from 'framer-motion';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useSettings } from '@/hooks/useContent';

/**
 * Living-hero background layers (gradient wash, animating grid, swept light
 * beam, orbital nodes). Purely decorative, low-opacity, transform/opacity only.
 * Renders nothing under reduced motion — HeroGradient supplies the static look.
 */
export function HeroAtmosphere() {
  const reduced = useReducedMotion();
  const { features } = useSettings();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* slow gradient breathing */}
      <div
        className="absolute inset-0 animate-gradient-shift bg-grad-radial opacity-[0.12]"
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* grid lines animate in */}
      {features.animatedGrid && (
        <motion.div
          className="grid-overlay animate-grid-pan absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* swept light beam */}
      <div
        className="animate-beam-sweep absolute -inset-y-16 left-0 w-1/3"
        style={{
          background:
            'linear-gradient(90deg, transparent, hsl(var(--glow-cyan) / 0.14), transparent)',
          filter: 'blur(10px)',
        }}
      />

      {/* orbital floating nodes */}
      <div className="animate-float absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-accent/50 blur-[1px]" />
      <div
        className="animate-float absolute right-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-accent-2/60 blur-[1px]"
        style={{ animationDelay: '1.2s' }}
      />
      <div
        className="animate-float absolute bottom-[26%] left-[22%] h-1.5 w-1.5 rounded-full bg-accent-3/50 blur-[1px]"
        style={{ animationDelay: '0.6s' }}
      />
      <div
        className="animate-float absolute bottom-[30%] right-[26%] h-1 w-1 rounded-full bg-accent/60"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
}
