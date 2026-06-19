import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { isRealHref } from '@/utils/href';
import { cn } from '@/utils/cn';
import type { Project } from '@/types';
import { fadeInUp } from '@/animations/variants';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  dimmed?: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ProjectCard({
  project,
  onOpen,
  dimmed,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, 4);
  const extra = project.tags.length - visibleTags.length;

  return (
    <motion.div
      variants={fadeInUp}
      layout
      data-cursor
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn('transition-[opacity,filter] duration-300', dimmed && 'opacity-50 saturate-50')}
    >
      <GlassCard
        interactive
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(project);
          }
        }}
        className="group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden p-6"
      >
        {/* Hover sheen */}
        <span
          className="pointer-events-none absolute inset-0 bg-grad-radial opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div className="flex items-center justify-between gap-3">
          <Badge tone="accent">{project.category}</Badge>
          {project.featured && (
            <span className="flex items-center gap-1 text-xs text-accent-2">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> Featured
            </span>
          )}
        </div>

        <h3 className="text-h3 font-display font-medium leading-snug transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {visibleTags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {extra > 0 && <span className="self-center text-xs text-subtle">+{extra}</span>}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            View details
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {isRealHref(project.github) && (
            <Github className="h-4 w-4 text-subtle" aria-hidden />
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
