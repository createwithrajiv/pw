import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { GradientText } from '@/components/ui/GradientText';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useMetrics, useProfile } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { parseStat } from '@/utils/format';
import { burstVariant, signatureSpring, staggerContainer } from '@/animations/variants';

interface NormalizedMetric {
  id: string;
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  icon?: string;
  context?: string;
}

function MetricItem({ m, index, reduced }: { m: NormalizedMetric; index: number; reduced: boolean }) {
  const [open, setOpen] = useState(false);
  const ctxId = `metric-ctx-${m.id}`;

  return (
    <motion.li
      variants={burstVariant(index, reduced)}
      tabIndex={m.context ? 0 : -1}
      aria-describedby={m.context ? ctxId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="group relative -m-2 flex flex-col items-center gap-3 rounded-lg p-2 text-center outline-none transition-colors focus-visible:bg-surface/40"
    >
      {m.icon && (
        <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface/60 text-accent transition-colors group-hover:border-accent/40">
          <IconRenderer name={m.icon} className="h-5 w-5" />
        </span>
      )}
      <span className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
        <GradientText>
          <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
        </GradientText>
      </span>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ ...signatureSpring, delay: 0.25 }}
        className="h-px w-12 origin-center bg-gradient-to-r from-accent to-accent-2"
      />
      <span className="text-sm text-muted">{m.label}</span>

      {m.context && (
        <motion.span
          id={ctxId}
          role="tooltip"
          initial={false}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-2 right-2 top-full z-10 mt-1 rounded-md border border-border bg-surface/95 px-3 py-2 text-xs leading-relaxed text-subtle backdrop-blur"
        >
          {m.context}
        </motion.span>
      )}
    </motion.li>
  );
}

export default function MetricsSection() {
  const metrics = useMetrics();
  const profile = useProfile();
  const reduced = useReducedMotion();

  const items: NormalizedMetric[] =
    metrics.items.length > 0
      ? metrics.items.map((m) => ({
          id: m.id,
          value: m.value,
          decimals: m.decimals ?? 0,
          prefix: m.prefix ?? '',
          suffix: m.suffix ?? '',
          label: m.label,
          icon: m.icon,
          context: m.context,
        }))
      : profile.stats.map((s, i) => {
          const parsed = parseStat(s.value);
          return { id: `stat-${i}`, ...parsed, label: s.label };
        });

  return (
    <Section id="metrics" grid ambient={{ density: 'sparse' }}>
      <Container>
        <div className="glass relative overflow-hidden rounded-2xl px-6 py-10 sm:px-12 sm:py-14">
          {/* in-view glow pulse, contained inside the box */}
          <div
            aria-hidden
            className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grad-radial opacity-50 blur-3xl"
          />
          {metrics.eyebrow && (
            <p className="eyebrow relative mb-9 flex items-center justify-center gap-2">
              <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
              {metrics.eyebrow}
            </p>
          )}
          <motion.ul
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
          >
            {items.map((m, i) => (
              <MetricItem key={m.id} m={m} index={i} reduced={reduced} />
            ))}
          </motion.ul>
        </div>
      </Container>
    </Section>
  );
}
