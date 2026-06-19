import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProjects, useProjectCategories } from '@/hooks/useContent';
import { useSpotlight } from '@/hooks/useSpotlight';
import { ProjectCard } from '@/sections/projects/ProjectCard';
import { ProjectModal } from '@/sections/projects/ProjectModal';
import { cn } from '@/utils/cn';
import type { Project } from '@/types';

const ALL = 'All';

export default function ProjectsSection() {
  const projects = useProjects();
  const categories = useProjectCategories();
  const spotlight = useSpotlight();
  const [filter, setFilter] = useState<string>(ALL);
  const [selected, setSelected] = useState<Project | null>(null);

  const filters = useMemo(() => [ALL, ...categories], [categories]);
  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <Section id="projects" grid>
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Projects that shipped"
          subtitle="Real systems with real numbers — click any card for the full breakdown."
        />

        {/* Filter bar */}
        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {filters.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={cn(
                'shrink-0 rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors',
                filter === cat
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border bg-surface/40 text-muted hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.div
            layout
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  onOpen={setSelected}
                  dimmed={spotlight.dimmed(i)}
                  {...spotlight.bind(i)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </Container>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
