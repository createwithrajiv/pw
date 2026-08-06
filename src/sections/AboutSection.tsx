import { MapPin, CheckCircle2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/motion/Reveal';
import { Marquee } from '@/components/ui/Marquee';
import { Tag } from '@/components/ui/Tag';
import { useProfile, useTechnologies } from '@/hooks/useContent';

const HEADLINE = [
  { text: 'Bridging' },
  { text: 'research' },
  { text: 'and' },
  { text: 'reliable', emphasis: true },
  { text: 'production', emphasis: true },
];

export default function AboutSection() {
  const profile = useProfile();
  const technologies = useTechnologies();

  return (
    <Section id="about">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <span className="eyebrow flex items-center gap-2">
                <span className="inline-block h-px w-6 bg-accent" aria-hidden />
                About
              </span>
              {/* Emphasis is carried by colour now that the gradient text is gone. */}
              <h2 className="text-h1 font-display tracking-tight">
                {HEADLINE.map((w, i) => (
                  <span key={w.text} className={w.emphasis ? 'text-accent' : undefined}>
                    {w.text}
                    {i < HEADLINE.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h2>
            </div>
            <Reveal variant="fadeInUp">
              <p className="text-lead text-foreground">{profile.description}</p>
            </Reveal>
            <Reveal variant="fadeInUp" delay={0.08}>
              <p className="text-body text-muted">{profile.longDescription}</p>
            </Reveal>
          </div>

          <div className="min-w-0 lg:self-center">
            <Reveal variant="fadeInUp">
              <GlassCard className="flex flex-col gap-6 p-8">
                <div className="flex flex-col gap-1">
                  <span className="eyebrow">Currently</span>
                  <span className="text-h3 font-display font-medium">{profile.title}</span>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  <span className="flex items-center gap-3 text-muted">
                    <MapPin className="h-4 w-4 text-accent" aria-hidden />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-3 text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
                    {profile.availability}
                  </span>
                </div>

                <div className="h-px w-full bg-border" aria-hidden />
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {profile.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <dt className="font-display text-h3 font-semibold">
                        {s.value}
                      </dt>
                      <dd className="text-xs leading-snug text-muted">{s.label}</dd>
                    </div>
                  ))}
                </dl>

                <div className="h-px w-full bg-border" aria-hidden />
                <div className="-mx-8">
                  <Marquee speed={28} gap="0.75rem">
                    {technologies.items.map((t) => (
                      <Tag key={t.name}>{t.name}</Tag>
                    ))}
                  </Marquee>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
