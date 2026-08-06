import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useExperience, useCompanies, useSectionCopy } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { cn } from '@/utils/cn';
import type { Experience, Company } from '@/types';

/** Company logo, linked to its website when one exists (from companies.json). */
function CompanyLogoLink({
  logo,
  website,
  name,
}: {
  logo?: string;
  website?: string | null;
  name: string;
}) {
  if (!logo) return null;
  const base =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-white/95 p-1.5';
  const img = (
    <img
      src={logo}
      alt={name}
      loading="lazy"
      decoding="async"
      className="max-h-full max-w-full object-contain"
    />
  );
  if (website) {
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} website`}
        data-cursor
        data-cursor-label="VISIT"
        className={cn(base, 'transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm')}
      >
        {img}
      </a>
    );
  }
  return (
    <div className={base} aria-label={name}>
      {img}
    </div>
  );
}

interface TimelineItemProps {
  item: Experience;
  company?: Company;
  progress: MotionValue<number>;
  t: number; // fractional position of this node down the spine
}

function TimelineItem({ item, company, progress, t }: TimelineItemProps) {
  // "Ignite" as the spine fill reaches this node.
  const lit = useTransform(progress, [t - 0.08, t], [0, 1], { clamp: true });
  const nodeScale = useTransform(lit, [0, 1], [1, 1.14]);
  const logo = company?.logo ?? item.company_logo;

  return (
    <div className="relative pl-12 sm:pl-16">
      {/* Node */}
      <motion.span
        style={{ scale: nodeScale }}
        className="absolute left-2 top-1.5 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-border bg-surface text-accent sm:left-3"
      >
        <motion.span
          aria-hidden
          style={{ opacity: lit }}
          className="absolute inset-0 rounded-full bg-accent shadow-sm"
        />
        <Briefcase className="relative z-10 h-4 w-4" aria-hidden />
      </motion.span>
      <div>
        <Card interactive className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <CompanyLogoLink logo={logo} website={company?.website} name={item.company} />
              <div>
                <h3 className="text-h3 font-sans font-medium">{item.role}</h3>
                <p className="mt-1 text-sm text-muted">
                  {item.company} · {item.location}
                </p>
                {item.department && (
                  <p className="mt-0.5 text-xs text-subtle">{item.department}</p>
                )}
              </div>
            </div>
            <Badge tone="accent">{item.employment_type}</Badge>
          </div>
          <span className="w-fit rounded-md bg-surface/70 px-3 py-1 font-mono text-xs text-subtle">
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
        </Card>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const experience = useExperience();
  const companies = useCompanies();
  const copy = useSectionCopy('experience');
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
    <Section id="experience" band>
      <Container>
        <SectionHeading {...copy} />

        <div ref={railRef} className="relative mt-14">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-border sm:left-3" aria-hidden />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-0 left-2 top-0 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent sm:left-3"
            aria-hidden
          />
          <div className="flex flex-col gap-10">
            {experience.map((item, i) => (
              <TimelineItem
                key={`${item.company}-${item.role}`}
                item={item}
                company={companies[item.company]}
                progress={progress}
                t={total > 1 ? i / (total - 1) : 0}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
