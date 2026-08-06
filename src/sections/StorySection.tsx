import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { usePersonalStory, useValues } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';

/** Story heading — reveals with a gentle fade as it enters (no scroll pin). */
function StoryNarrative({
  eyebrow,
  heading,
  subheading,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      {eyebrow && (
        <p className="eyebrow flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className="max-w-3xl text-h1 font-display font-semibold tracking-tight">
        {heading}
      </h2>
      {subheading && <p className="text-lead text-muted">{subheading}</p>}
    </motion.div>
  );
}

export default function StorySection() {
  const story = usePersonalStory();
  const values = useValues();  const hasStory = story.paragraphs.length > 0;
  const hasValues = values.items.length > 0;

  return (
    <Section id="story">
      <Container>        <div className="flex flex-col gap-14">
          {hasStory && (
            <div className="flex flex-col gap-6">
              <StoryNarrative
                eyebrow={story.eyebrow}
                heading={story.heading}
                subheading={story.subheading}
              />
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-7">
                {story.paragraphs.map((p, i) => (
                  <div key={i}>
                    <div>
                      {p.heading && (
                        <h3 className="mb-1 font-mono text-sm uppercase tracking-wider text-accent">
                          {p.heading}
                        </h3>
                      )}
                      <p className="text-body leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </div>
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
                {values.items.map((v) => (
                  <motion.div
                    key={v.title}
                    variants={fadeInUp}
                    className="h-full"
                  >
                    <GlassCard className="flex h-full flex-col gap-3 p-6">
                      <span className="grid h-10 w-10 place-items-center rounded-md bg-grad-accent/10 text-accent ring-1 ring-accent/20">
                        <IconRenderer name={v.icon} className="h-5 w-5" />
                      </span>
                      <h3 className="font-display font-medium">{v.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{v.description}</p>
                    </GlassCard>
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
