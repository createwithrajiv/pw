import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useMetrics, useProfile } from '@/hooks/useContent';
import { parseStat } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/animations/variants';

import { Modal } from '@/components/ui/Modal';
import { X } from 'lucide-react';
import type { MetricDetails } from '@/types';

interface NormalizedMetric {
  id: string;
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  icon?: string;
  context?: string;
  details?: MetricDetails;
}

function Breakdown({
  m,
  open,
  onClose,
}: {
  m: NormalizedMetric;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = `metric-detail-${m.id}`;
  if (!m.details) return null;
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="panel rounded-lg p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">
              {m.prefix}
              {m.value}
              {m.suffix} {m.label}
            </p>
            <h3 id={titleId} className="text-h2 font-sans">
              {m.details.heading}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {m.details.intro && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{m.details.intro}</p>
        )}

        <div className="mt-7 flex flex-col gap-7">
          {m.details.groups.map((g, gi) => (
            <div key={g.title ?? gi}>
              {g.title && <p className="eyebrow mb-3">{g.title}</p>}
              <ul className="flex flex-col divide-y divide-border border-y border-border">
                {g.items.map((item) => (
                  <li
                    key={item.name + item.note}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="font-sans text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted sm:max-w-[62%] sm:text-right">
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function MetricItem({ m }: { m: NormalizedMetric }) {
  const [tipOpen, setTipOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const hasDetails = Boolean(m.details);

  const body = (
    <>
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
      {m.context && <span className="sr-only">{m.context}</span>}
      {hasDetails && (
        <span className="text-xs font-medium text-accent transition-colors group-hover:text-accent-hover">
          View breakdown
        </span>
      )}
    </>
  );

  // Hover/focus reveals the one-line context; tiles that have a breakdown are
  // also buttons opening the full list. A tooltip cannot carry nineteen agents.
  const shared = {
    onMouseEnter: () => setTipOpen(true),
    onMouseLeave: () => setTipOpen(false),
    onFocus: () => setTipOpen(true),
    onBlur: () => setTipOpen(false),
    className:
      'group flex w-full flex-col items-center gap-3 rounded-lg p-2 text-center outline-none transition-colors focus-visible:bg-surface',
  };

  return (
    <motion.li variants={fadeInUp} className="relative -m-2">
      {hasDetails ? (
        <button
          {...shared}
          onClick={() => setDetailOpen(true)}
          aria-haspopup="dialog"
        >
          {body}
        </button>
      ) : (
        <div {...shared}>
          {body}
        </div>
      )}

      {m.context && (
        <motion.span
          aria-hidden
          initial={false}
          // The horizontal centring has to go through framer, not a
          // -translate-x-1/2 class: framer writes transform inline, which
          // overwrites the utility and leaves the tooltip's left edge pinned to
          // the item's centre - pushing the last one off the panel.
          animate={{ opacity: tipOpen ? 1 : 0, x: '-50%', y: tipOpen ? 0 : -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 max-w-[15rem] rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted shadow-md"
        >
          {m.context}
        </motion.span>
      )}

      <Breakdown m={m} open={detailOpen} onClose={() => setDetailOpen(false)} />
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
          details: m.details,
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
            className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3"
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
