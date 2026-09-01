import { useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProjects, useProjectCategories, useSectionCopy } from '@/hooks/useContent';
import { ProjectCard } from '@/sections/projects/ProjectCard';
import { ProjectModal } from '@/sections/projects/ProjectModal';
import { cn } from '@/utils/cn';
import type { Project } from '@/types';

const ALL = 'All';

export default function ProjectsSection() {
  const projects = useProjects();
  const categories = useProjectCategories();
  const copy = useSectionCopy('projects');
  const [filter, setFilter] = useState<string>(ALL);
  const [selected, setSelected] = useState<Project | null>(null);

  const filters = useMemo(() => [ALL, ...categories], [categories]);
  const visible = useMemo(() => {
    const inFilter = filter === ALL ? projects : projects.filter((p) => p.category === filter);
    // Stable sort: featured first, original order preserved within each group.
    return [...inFilter].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter, projects]);

  return (
    <Section id="projects">
      <Container>
        <SectionHeading {...copy} />

        {/* Filter bar */}
        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {filters.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={cn(
                'shrink-0 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors',
                filter === cat
                  ? 'border-accent bg-accent/10 text-accent-strong'
                  : 'border-border bg-surface text-muted hover:border-accent hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onOpen={setSelected}
            />
          ))}
        </div>
      </Container>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
