import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { useTestimonials } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { EASE } from '@/animations/variants';
import { cn } from '@/utils/cn';

export default function TestimonialsSection() {
  const testimonials = useTestimonials();
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const current = testimonials[index];
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  const autoActive = !reduced && !hoverPaused && !tabHidden && count > 1;
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

  return (
    <Section id="testimonials">
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
          {/* giant drifting quote mark */}
          <span
            aria-hidden
            className="text-gradient animate-gradient-shift pointer-events-none absolute -left-2 -top-16 select-none font-display text-[10rem] leading-none opacity-20"
          >
            &ldquo;
          </span>

          <GlassCard className="relative min-h-[260px] overflow-hidden p-8 sm:p-10">
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
                className="flex cursor-grab flex-col gap-6 active:cursor-grabbing"
              >
                <blockquote className="text-h3 font-display font-medium leading-snug text-foreground">
                  {reduced ? (
                    `“${current.quote}”`
                  ) : (
                    <AnimatedText text={`“${current.quote}”`} stagger={0.012} />
                  )}
                </blockquote>
                <figcaption className="flex flex-col">
                  <span className="font-display font-medium">{current.author}</span>
                  <span className="text-sm text-muted">{current.role}</span>
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
    </Section>
  );
}
