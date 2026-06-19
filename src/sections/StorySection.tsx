import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/ui/GradientText';
import { TiltCard } from '@/components/ui/TiltCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { Reveal } from '@/components/motion/Reveal';
import { ScrubReveal } from '@/components/motion/ScrubReveal';
import { SectionDivider } from '@/components/motion/SectionDivider';
import { useSpotlight } from '@/hooks/useSpotlight';
import { usePersonalStory, useValues } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import { cn } from '@/utils/cn';

export default function StorySection() {
  const story = usePersonalStory();
  const values = useValues();
  const spotlight = useSpotlight();
  const hasStory = story.paragraphs.length > 0;
  const hasValues = values.items.length > 0;

  return (
    <Section id="story" grid>
      <Container>
        <SectionDivider className="mb-12" />
        <div className="flex flex-col gap-14">
          {hasStory && (
            <div className="flex flex-col gap-6">
              {story.eyebrow && (
                <p className="eyebrow flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
                  {story.eyebrow}
                </p>
              )}
              <Reveal variant="riseIn">
                <h2 className="max-w-3xl text-h1 font-display font-semibold tracking-tight">
                  <GradientText>{story.heading}</GradientText>
                </h2>
              </Reveal>
              {story.subheading && (
                <Reveal variant="fadeInUp" delay={0.05}>
                  <p className="text-lead text-muted">{story.subheading}</p>
                </Reveal>
              )}
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-7">
                {story.paragraphs.map((p, i) => (
                  <ScrubReveal key={i} from={{ y: 36, opacity: 0 }}>
                    <div>
                      {p.heading && (
                        <h3 className="mb-1 font-mono text-sm uppercase tracking-wider text-accent">
                          {p.heading}
                        </h3>
                      )}
                      <p className="text-body leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </ScrubReveal>
                ))}
              </div>
            </div>
          )}

          {hasValues && (
            <div className="flex flex-col gap-6">
              <p className="eyebrow">{values.heading}</p>
              <motion.div
                variants={staggerContainer(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {values.items.map((v, i) => (
                  <motion.div
                    key={v.title}
                    variants={fadeInUp}
                    className={cn(
                      'h-full transition-[opacity,filter] duration-300',
                      spotlight.dimmed(i) && 'opacity-50 saturate-50',
                    )}
                    {...spotlight.bind(i)}
                  >
                    <TiltCard className="flex h-full flex-col gap-3 p-6">
                      <span className="grid h-10 w-10 place-items-center rounded-md bg-grad-accent/10 text-accent ring-1 ring-accent/20">
                        <IconRenderer name={v.icon} className="h-5 w-5" />
                      </span>
                      <h3 className="font-display font-medium">{v.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{v.description}</p>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
