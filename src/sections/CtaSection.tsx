import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { useCta } from '@/hooks/useContent';

export default function CtaSection() {
  const cta = useCta();
  return (
    <Section id="cta" band>
      <Container className="relative">
        <div className="relative overflow-hidden rounded-lg border border-border bg-base px-6 py-20 text-center sm:px-12">
          <div className="relative z-10 flex flex-col items-center gap-7">
            {cta.eyebrow && <p className="eyebrow">{cta.eyebrow}</p>}
            <h2 className="max-w-3xl text-balance text-display font-sans font-semibold leading-[1.05] tracking-tight">
              {cta.heading}
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
                  >
                    {btn.label}
                    {i === 0 && <ArrowUpRight className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </Reveal>
            <p className="mt-6 font-sans text-sm text-subtle">
              Available now - let's talk.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
