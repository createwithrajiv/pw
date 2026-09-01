import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { ProfileFrame } from '@/components/hero/ProfileFrame';
import { useMetrics, useProfile, useSocial } from '@/hooks/useContent';
import { scrollTo } from '@/utils/scroll';
import { parseStat } from '@/utils/format';
import { Counter } from '@/components/ui/Counter';
import { fadeInUp, slideUp, staggerContainer } from '@/animations/variants';

export default function HeroSection() {
  const profile = useProfile();
  const social = useSocial();
  const metrics = useMetrics();
  // One source of truth: the hero row is whichever metrics are flagged
  // `hero` in metrics.json. profile.stats remains the fallback.
  const flagged = metrics.items.filter((m) => m.hero);
  const teaser =
    flagged.length > 0
      ? flagged.map((m) => ({
          key: m.id,
          label: m.label,
          value: m.value,
          decimals: m.decimals ?? 0,
          prefix: m.prefix ?? '',
          suffix: m.suffix ?? '',
        }))
      : profile.stats.slice(0, 3).map((stat, i) => ({
          key: `stat-${i}`,
          label: stat.label,
          ...parseStat(stat.value),
        }));

  return (
    <Section id="hero" className="!pb-12 !pt-24 sm:!pt-28">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.25fr_minmax(0,16rem)] lg:gap-14">
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="flex max-w-2xl flex-col gap-4"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>
          </motion.div>

          <motion.p variants={fadeInUp} className="eyebrow">
            {profile.name} · {profile.title}
          </motion.p>

          {/* Opacity stays at 1 — this is the LCP element, so it must paint on
              the first frame rather than at the end of the animation. */}
          <motion.h1
            variants={slideUp}
            className="text-display font-sans tracking-tight"
          >
            {profile.tagline}
          </motion.h1>

          <motion.p variants={fadeInUp} className="max-w-2xl text-lead text-muted">
            {profile.description}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
            <Button href={profile.resumeUrl} external size="lg">
              <FileText className="h-4 w-4" aria-hidden />
              Download Résumé
            </Button>
            <Button variant="secondary" size="lg" onClick={() => scrollTo('#projects')}>
              View Work
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-1 flex flex-wrap items-start gap-x-10 gap-y-4 border-t border-border pt-5"
          >
            {teaser.map((stat) => (
              <div key={stat.key} className="flex flex-col">
                <span className="font-sans text-2xl font-bold text-foreground">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </span>
                <span className="mt-1 max-w-[14ch] text-xs text-muted">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <span className="eyebrow">Find me</span>
            <div className="flex gap-2">
              {social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <IconRenderer name={s.icon} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <ProfileFrame
          image={profile.image}
          name={profile.name}
          className="order-first lg:order-none lg:justify-self-end"
        />
      </Container>
    </Section>
  );
}
