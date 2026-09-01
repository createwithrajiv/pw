import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useSkills, useSectionCopy } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';

// Keys MUST match the category names in skills.json exactly (an unknown name
// falls back to a "?" HelpCircle icon).
const CATEGORY_ICONS: Record<string, string> = {
  'Core Concepts': 'code',
  'AI / ML & GenAI': 'brain',
  'Knowledge Graphs & Vector Databases': 'network',
  'Backend Development': 'server',
  'Databases & Data Engineering': 'database',
  'Cloud, DevOps & Infrastructure': 'cloud',
};

export default function SkillsSection() {
  const skills = useSkills();
  const copy = useSectionCopy('skills');
  return (
    <Section id="skills">
      <Container>
        <SectionHeading {...copy} />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.categories.map((cat) => (
            <motion.div key={cat.name} variants={fadeInUp} className="h-full">
              <Card className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-center gap-3.5 border-b border-border/60 pb-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                    <IconRenderer name={CATEGORY_ICONS[cat.name]} className="h-[22px] w-[22px]" />
                  </span>
                  <h3 className="font-sans text-lg font-medium leading-snug text-foreground">
                    {cat.name}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}                      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
