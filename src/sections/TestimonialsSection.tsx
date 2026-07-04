import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { useTestimonials } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { EASE } from '@/animations/variants';
import { cn } from '@/utils/cn';

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function Avatar({ photo, name, size = 'md' }: { photo?: string; name: string; size?: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-12 w-12 text-base';
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        className={cn('shrink-0 rounded-full object-cover ring-1 ring-border', dim)}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-grad-accent font-display font-semibold text-primary-foreground',
        dim,
      )}
    >
      {initials(name)}
    </div>
  );
}

function CompanyLogo({ logo, company }: { logo?: string; company: string }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={company}
        loading="lazy"
        decoding="async"
        className="max-h-8 w-auto max-w-[110px] shrink-0 rounded bg-white/95 object-contain p-1.5"
      />
    );
  }
  return <span className="shrink-0 text-sm font-medium text-muted">{company}</span>;
}

export default function TestimonialsSection() {
  const testimonials = useTestimonials();
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const current = testimonials[index];
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  const autoActive = !reduced && !hoverPaused && !tabHidden && !detailOpen && count > 1;
  useEffect(() => {
    if (!autoActive) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => window.clearInterval(id);
  }, [autoActive, count]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!current) return null;
  const detailParagraphs = (current.detailed_quote ?? '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Section id="testimonials" ambient>
      <Container>
        <SectionHeading
          eyebrow="Social proof"
          title="What people say"
          subtitle="Engineering leaders on what it's like to ship with me."
          align="center"
        />

        <div
          className="relative mx-auto mt-14 max-w-3xl"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocusCapture={() => setHoverPaused(true)}
          onBlurCapture={() => setHoverPaused(false)}
        >
          <span
            aria-hidden
            className="text-gradient animate-gradient-shift pointer-events-none absolute -left-2 -top-16 select-none font-display text-[10rem] leading-none opacity-20"
          >
            &ldquo;
          </span>

          <GlassCard className="relative min-h-[340px] overflow-hidden p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: EASE }}
                drag={reduced ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                aria-live="polite"
                data-cursor
                data-cursor-label="DRAG"
                className="flex cursor-grab flex-col gap-6 active:cursor-grabbing"
              >
                <blockquote className="text-h3 font-display font-medium leading-snug text-foreground">
                  {reduced ? (
                    `“${current.quote}”`
                  ) : (
                    <AnimatedText text={`“${current.quote}”`} stagger={0.012} />
                  )}
                </blockquote>

                {current.detailed_quote && (
                  <button
                    onClick={() => setDetailOpen(true)}
                    className="link-underline inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    Read full recommendation
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}

                <figcaption className="mt-auto flex items-center gap-4 border-t border-border pt-5">
                  <Avatar photo={current.profile_picture} name={current.author} />
                  <div className="flex min-w-0 flex-col">
                    <span className="font-display font-medium leading-tight">{current.author}</span>
                    <span className="truncate text-sm text-muted">{current.role}</span>
                  </div>
                  <div className="ml-auto">
                    <CompanyLogo logo={current.company_logo} company={current.company} />
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </GlassCard>

          {count > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.author}
                    onClick={() => setIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      i === index ? 'w-6 bg-accent' : 'w-2 bg-border-strong hover:bg-accent/50',
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        labelledBy="testimonial-detail-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="glass relative rounded-xl p-7 sm:p-9"
        >
          <button
            onClick={() => setDetailOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-pill border border-border bg-surface/70 text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4 pr-10">
            <Avatar photo={current.profile_picture} name={current.author} size="lg" />
            <div className="flex min-w-0 flex-col">
              <span id="testimonial-detail-title" className="text-h3 font-display font-medium">
                {current.author}
              </span>
              <span className="text-sm text-muted">{current.role}</span>
            </div>
            <div className="ml-auto hidden sm:block">
              <CompanyLogo logo={current.company_logo} company={current.company} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-body leading-relaxed text-muted">
            {detailParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </Modal>
    </Section>
  );
}
