import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Mail, MapPin } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { Reveal } from '@/components/motion/Reveal';
import { SectionDivider } from '@/components/motion/SectionDivider';
import { usePointerGlow } from '@/hooks/usePointerGlow';
import { useProfile, useSocial } from '@/hooks/useContent';
import { EASE } from '@/animations/variants';

export default function ContactSection() {
  const profile = useProfile();
  const social = useSocial();
  const [copied, setCopied] = useState(false);
  const glow = usePointerGlow<HTMLDivElement>({ size: 460, alpha: 0.08 });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="contact" ambient>
      <Container>
        <SectionDivider className="mb-12" />
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
              Get in touch
            </p>
            <Reveal variant="fadeInUp">
              <h2 className="text-h1 font-display font-semibold tracking-tight">
                Let's build something <GradientText>that scales</GradientText>.
              </h2>
            </Reveal>
            <Reveal variant="fadeInUp" delay={0.05}>
              <p className="max-w-md text-lead text-muted">{profile.availability}.</p>
            </Reveal>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">
              <MapPin className="h-4 w-4 text-accent" aria-hidden />
              {profile.location}
            </div>
          </div>

          <GlassCard ref={glow.ref} className="relative flex flex-col gap-6 overflow-hidden p-8">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
              style={{ background: glow.background }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="eyebrow">Email</span>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/50 p-4">
                <span className="flex items-center gap-3 truncate font-mono text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="truncate">{profile.email}</span>
                </span>
                <span className="relative shrink-0">
                  <button
                    onClick={copyEmail}
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                    className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        key="ring"
                        aria-hidden
                        initial={{ scale: 0.6, opacity: 0.7 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="pointer-events-none absolute inset-0 rounded-md border border-accent"
                      />
                    )}
                  </AnimatePresence>
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3">
              <Button href={`mailto:${profile.email}`} magnetic>
                <Mail className="h-4 w-4" />
                Send a message
              </Button>
              <Button href={profile.resumeUrl} external variant="secondary">
                View résumé
              </Button>
            </div>

            <div className="relative z-10 border-t border-border pt-5">
              <span className="eyebrow mb-3 block">Elsewhere</span>
              <div className="flex gap-3">
                {social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="grid h-11 w-11 place-items-center rounded-pill border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <IconRenderer name={s.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}
