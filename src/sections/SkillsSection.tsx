import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { SectionDivider } from '@/components/motion/SectionDivider';
import { useSkills } from '@/hooks/useContent';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { burstVariant, staggerContainer } from '@/animations/variants';

const CATEGORY_ICONS: Record<string, string> = {
  'AI / ML': 'brain',
  'Backend & Infrastructure': 'server',
  'Cloud & DevOps': 'cloud',
  'Data Engineering': 'database',
  'MLOps & Monitoring': 'activity',
};

// Decorative constellation behind the cards (a calm 2D nod to the hero network).
const NODES = [
  { x: 12, y: 28 },
  { x: 44, y: 16 },
  { x: 80, y: 30 },
  { x: 26, y: 72 },
  { x: 60, y: 80 },
  { x: 90, y: 64 },
];
const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 2],
  [4, 5],
  [2, 5],
];

function Constellation() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.g
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.1)}
      >
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="hsl(var(--accent) / 0.22)"
            strokeWidth={0.25}
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={0.6}
            fill="hsl(var(--accent) / 0.5)"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          />
        ))}
      </motion.g>
    </svg>
  );
}

export default function SkillsSection() {
  const skills = useSkills();
  const reduced = useReducedMotion();

  return (
    <Section id="skills" ambient={{ density: 'sparse', motes: false }}>
      <Constellation />
      <Container className="relative z-10">
        <SectionDivider className="mb-12" />
        <SectionHeading
          eyebrow="Toolkit"
          title="Skills & technologies"
          subtitle="The stack I reach for to take models from notebook to production — everything, upfront."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.categories.map((cat, i) => (
            <motion.div key={cat.name} variants={burstVariant(i, reduced)} className="h-full">
              <TiltCard className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-grad-accent/10 text-accent ring-1 ring-accent/20">
                    <IconRenderer name={CATEGORY_ICONS[cat.name]} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-medium leading-tight">{cat.name}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      data-cursor
                      className="rounded-pill border border-border bg-surface/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
