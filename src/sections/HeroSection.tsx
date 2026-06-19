import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { GradientText } from '@/components/ui/GradientText';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { HeroBackdrop } from '@/components/three/HeroBackdrop';
import { ProfileFrame } from '@/components/hero/ProfileFrame';
import { useProfile, useSocial } from '@/hooks/useContent';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';
import { useIntroSequence } from '@/hooks/useIntroSequence';
import { usePointerGlow } from '@/hooks/usePointerGlow';
import { parseStat } from '@/utils/format';
import { Counter } from '@/components/ui/Counter';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

export default function HeroSection() {
  const profile = useProfile();
  const social = useSocial();
  const { scrollTo } = useSmoothScroll();
  const { step } = useIntroSequence();
  const reduced = useReducedMotion();
  const glow = usePointerGlow<HTMLElement>({ size: 520, alpha: 0.1 });
  const teaser = profile.stats.slice(0, 3);
  const show = (n: number) => (step >= n ? 'show' : 'hidden');

  // Cinematic scroll-out: the content recedes (lift + fade + blur + slight scale)
  // as the hero leaves the viewport.
  const { scrollYProgress } = useScroll({ target: glow.ref, offset: ['start start', 'end start'] });
  const outOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const outY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const outScale = useTransform(scrollYProgress, [0, 1], [1, 0.985]);
  const outBlurPx = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const outBlur = useMotionTemplate`blur(${outBlurPx}px)`;
  const outStyle = reduced
    ? undefined
    : { opacity: outOpacity, y: outY, scale: outScale, filter: outBlur };

  return (
    <Section ref={glow.ref} id="hero" className="!py-0">
      <HeroBackdrop />
      {/* cursor-tracking glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
        style={{ background: glow.background }}
      />

      <motion.div style={outStyle} className="relative z-10">
        <Container className="grid min-h-[100svh] grid-cols-1 items-center gap-12 pb-24 pt-32 lg:grid-cols-[1.3fr_minmax(0,20rem)] lg:gap-16">
        <div className="flex max-w-2xl flex-col gap-7">
          <motion.div variants={fadeInUp} initial="hidden" animate={show(2)}>
            <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface/50 px-3 py-1.5 text-sm text-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>
          </motion.div>

          <motion.p variants={fadeInUp} initial="hidden" animate={show(2)} className="eyebrow">
            {profile.name} — {profile.title}
          </motion.p>

          <h1 className="text-display font-display font-semibold leading-[1.02] tracking-tight">
            <AnimatedText text={profile.tagline} split="word" play={step >= 3} />
          </h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={show(3)}
            className="max-w-2xl text-lead text-muted"
          >
            {profile.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={show(5)}
            className="flex flex-wrap items-center gap-3"
          >
            <Button href={profile.resumeUrl} external magnetic size="lg">
              <FileText className="h-4 w-4" />
              Download Résumé
            </Button>
            <Button variant="secondary" size="lg" magnetic onClick={() => scrollTo('#projects')}>
              View Work
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate={show(4)}
            className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-6"
          >
            {teaser.map((stat) => {
              const parsed = parseStat(stat.value);
              return (
                <motion.div key={stat.label} variants={fadeInUp} className="flex flex-col">
                  <span className="font-display text-3xl font-semibold">
                    <GradientText>
                      <Counter
                        value={parsed.value}
                        decimals={parsed.decimals}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        start={step >= 4}
                      />
                    </GradientText>
                  </span>
                  <span className="mt-1 max-w-[12ch] text-xs text-subtle">{stat.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={show(5)}
            className="mt-2 flex items-center gap-4"
          >
            <span className="text-xs uppercase tracking-widest text-subtle">Find me</span>
            <div className="flex gap-2">
              {social.map((s) => (
                <motion.a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface/40 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <IconRenderer name={s.icon} className="h-[18px] w-[18px]" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <ProfileFrame
          image={profile.image}
          name={profile.name}
          play={step >= 2}
          className="lg:justify-self-end"
        />
        </Container>
      </motion.div>

      <button
        onClick={() => scrollTo('#metrics')}
        aria-label="Scroll to next section"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-subtle transition-colors hover:text-accent sm:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-scroll-cue" />
      </button>
    </Section>
  );
}
