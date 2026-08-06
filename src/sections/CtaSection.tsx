import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { Reveal } from '@/components/motion/Reveal';
import { usePointerGlow } from '@/hooks/usePointerGlow';
import { useCta } from '@/hooks/useContent';

export default function CtaSection() {
  const cta = useCta();
  const glow = usePointerGlow<HTMLDivElement>({ size: 600, alpha: 0.12 });

  return (
    <Section id="cta" band>
      <Container className="relative">
        <div
          ref={glow.ref}
          className="relative overflow-hidden rounded-2xl border border-border bg-base/30 px-6 py-20 text-center sm:px-12"
        >
          {/* cursor-reactive gradient field */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
            style={{ background: glow.background }}
          />
          <div className="relative z-10 flex flex-col items-center gap-7">
            {cta.eyebrow && <p className="eyebrow">{cta.eyebrow}</p>}
            <h2 className="max-w-3xl text-balance text-display font-display font-semibold leading-[1.05] tracking-tight">
              <AnimatedText text={cta.heading} split="word" />
            </h2>
            <Reveal variant="fadeIn" delay={0.1}>
              <p className="max-w-xl text-lead text-muted">{cta.subheading}</p>
            </Reveal>
            <Reveal variant="fadeInUp" delay={0.15}>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                {cta.buttons.map((btn, i) => (
                  <Button
                    key={btn.label}
                    href={btn.href}
                    external={btn.external}
                    variant={btn.variant}
                    size="lg"
                    magnetic={i === 0}
                  >
                    {btn.label}
                    {i === 0 && <ArrowUpRight className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </Reveal>
            <p className="mt-6 font-display text-sm text-subtle">
              <GradientText>Available now</GradientText> - let's talk.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
