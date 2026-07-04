import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FlyIn } from '@/components/motion/FlyIn';
import { useExperience } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import type { Experience } from '@/types';

interface TimelineItemProps {
  item: Experience;
  progress: MotionValue<number>;
  t: number; // fractional position of this node down the spine
  index: number;
}

function TimelineItem({ item, progress, t, index }: TimelineItemProps) {
  // "Ignite" as the spine fill reaches this node.
  const lit = useTransform(progress, [t - 0.08, t], [0, 1], { clamp: true });
  const nodeScale = useTransform(lit, [0, 1], [1, 1.14]);

  return (
    <div className="relative pl-12 sm:pl-16">
      {/* Node */}
      <motion.span
        style={{ scale: nodeScale }}
        className="absolute left-2 top-1.5 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-border bg-elevated text-accent sm:left-3"
      >
        <motion.span
          aria-hidden
          style={{ opacity: lit }}
          className="absolute inset-0 rounded-full bg-grad-accent shadow-glow"
        />
        <Briefcase className="relative z-10 h-4 w-4" aria-hidden />
      </motion.span>
      <FlyIn direction={index % 2 === 0 ? 'left' : 'right'} blur={8}>
        <GlassCard interactive className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-h3 font-display font-medium">{item.role}</h3>
              <p className="mt-1 text-sm text-muted">
                {item.company} · {item.location}
              </p>
            </div>
            <Badge tone="accent">{item.employment_type}</Badge>
          </div>
          <span className="w-fit rounded-pill bg-surface/70 px-3 py-1 font-mono text-xs text-subtle">
            {item.period}
          </span>
          <p className="text-sm leading-relaxed text-muted">{item.description}</p>
          {item.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {item.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1 text-xs text-foreground"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </FlyIn>
    </div>
  );
}

export default function ExperienceSection() {
  const experience = useExperience();
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 70%', 'end 70%'] });
  const sprung = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const staticOne = useMotionValue(1);

  // Reduced motion: spine full + all nodes lit (no scroll-linked motion).
  const scaleY = reduced ? staticOne : sprung;
  const progress = reduced ? staticOne : scrollYProgress;
  const total = experience.length;

  return (
    <Section id="experience" ambient={{ density: 'sparse', motes: false }}>
      <Container>
        <SectionHeading
          eyebrow="The journey"
          title="Experience"
          subtitle="Roles where I shipped AI systems that had to stay up."
        />

        <div ref={railRef} className="relative mt-14">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-border sm:left-3" aria-hidden />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-0 left-2 top-0 w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3 sm:left-3"
            aria-hidden
          />
          <div className="flex flex-col gap-10">
            {experience.map((item, i) => (
              <TimelineItem
                key={`${item.company}-${item.role}`}
                item={item}
                progress={progress}
                t={total > 1 ? i / (total - 1) : 0}
                index={i}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
