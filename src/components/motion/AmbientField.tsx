import { motion, useTransform } from 'framer-motion';
import { useFxSignals } from '@/hooks/useFxSignals';
import { cn } from '@/utils/cn';

interface NodeDef {
  x: string;
  y: string;
  size: number;
  depth: number;
  color: string;
  delay: string;
}

const NODES: NodeDef[] = [
  { x: '10%', y: '24%', size: 8, depth: 22, color: 'bg-accent/50', delay: '0s' },
  { x: '82%', y: '18%', size: 6, depth: 30, color: 'bg-accent-2/60', delay: '1.1s' },
  { x: '24%', y: '72%', size: 6, depth: 18, color: 'bg-accent-3/50', delay: '0.6s' },
  { x: '68%', y: '78%', size: 5, depth: 26, color: 'bg-accent/60', delay: '2s' },
  { x: '46%', y: '40%', size: 4, depth: 14, color: 'bg-accent-2/40', delay: '1.6s' },
  { x: '90%', y: '60%', size: 5, depth: 34, color: 'bg-accent-3/40', delay: '0.3s' },
  { x: '34%', y: '12%', size: 4, depth: 20, color: 'bg-accent/40', delay: '2.4s' },
];

const MOTES = Array.from({ length: 8 }, (_, i) => ({
  x: `${8 + ((i * 12) % 84)}%`,
  y: `${15 + ((i * 23) % 70)}%`,
  delay: `${i * 0.7}s`,
}));

function AmbientNode({ node, parallax, lite }: { node: NodeDef; parallax: number; lite: boolean }) {
  const fx = useFxSignals();
  const x = useTransform(fx.mouse.x, [-1, 1], [-node.depth * parallax, node.depth * parallax]);
  const y = useTransform(fx.mouse.y, [-1, 1], [-node.depth * parallax, node.depth * parallax]);
  return (
    <motion.span
      aria-hidden
      className={cn('animate-float absolute rounded-full blur-[1px]', node.color)}
      style={{
        left: node.x,
        top: node.y,
        width: node.size,
        height: node.size,
        animationDelay: node.delay,
        ...(lite ? {} : { x, y }),
      }}
    />
  );
}

interface AmbientFieldProps {
  density?: 'sparse' | 'normal';
  motes?: boolean;
  parallax?: number;
  className?: string;
}

/** Per-section drifting nodes + data motes with cursor parallax. Reduced → null. */
export function AmbientField({
  density = 'normal',
  motes = true,
  parallax = 0.15,
  className,
}: AmbientFieldProps) {
  const fx = useFxSignals();
  if (fx.tier === 'off') return null;
  const lite = fx.tier === 'lite';
  const nodes = density === 'sparse' ? NODES.slice(0, 4) : NODES;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-[1] overflow-hidden', className)}
    >
      {nodes.map((node, i) => (
        <AmbientNode key={i} node={node} parallax={parallax} lite={lite} />
      ))}
      {motes &&
        !lite &&
        MOTES.map((m, i) => (
          <span
            key={`m-${i}`}
            aria-hidden
            className="animate-float absolute h-[3px] w-[3px] rounded-full bg-accent/40"
            style={{ left: m.x, top: m.y, animationDelay: m.delay }}
          />
        ))}
    </div>
  );
}
