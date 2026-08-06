import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useMetrics, useProfile } from '@/hooks/useContent';
import { parseStat } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/animations/variants';

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

function MetricItem({ m }: { m: NormalizedMetric }) {
  const [open, setOpen] = useState(false);
  const ctxId = `metric-ctx-${m.id}`;

  return (
    <motion.li
      variants={fadeInUp}
      tabIndex={m.context ? 0 : -1}
      aria-describedby={m.context ? ctxId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="group relative -m-2 flex flex-col items-center gap-3 rounded-lg p-2 text-center outline-none transition-colors focus-visible:bg-surface"
    >
      {m.icon && (
        <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-accent transition-colors group-hover:border-accent">
          <IconRenderer name={m.icon} className="h-5 w-5" />
        </span>
      )}
      <span className="font-sans text-5xl font-semibold tracking-tight sm:text-6xl">
        <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
      </span>
      <span aria-hidden className="h-px w-12 bg-border" />
      <span className="text-sm text-muted">{m.label}</span>

      {m.context && (
        <motion.span
          id={ctxId}
          role="tooltip"
          initial={false}
          // The horizontal centring has to go through framer, not a
          // -translate-x-1/2 class: framer writes `transform` inline, which
          // overwrites the utility and leaves the tooltip's left edge pinned to
          // the item's centre — pushing the last one off the panel.
          animate={{ opacity: open ? 1 : 0, x: '-50%', y: open ? 0 : -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 max-w-[15rem] rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted shadow-md"
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
    <Section id="metrics" band>
      <Container>
        {/* No overflow-hidden — it clipped the metric tooltips. The blurred
            blob it used to contain is gone. */}
        <div className="panel relative rounded-lg px-6 py-10 sm:px-12 sm:py-14">
          {/* in-view glow pulse, contained inside the box */}
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
            {items.map((m) => (
              <MetricItem key={m.id} m={m} />
            ))}
          </motion.ul>
        </div>
      </Container>
    </Section>
  );
}
