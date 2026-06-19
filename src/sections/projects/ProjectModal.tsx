import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { isRealHref } from '@/utils/href';
import { EASE } from '@/animations/variants';
import type { Project } from '@/types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Keep the last project rendered during the close animation.
  const [shown, setShown] = useState<Project | null>(project);
  useEffect(() => {
    if (project) setShown(project);
  }, [project]);

  const open = !!project;
  const data = project ?? shown;
  if (!data) return null;

  const hasLive = isRealHref(data.link);
  const hasCode = isRealHref(data.github);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="project-modal-title"
      describedBy="project-modal-desc"
      className="p-4 sm:p-0"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="glass relative rounded-xl p-7 sm:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-pill border border-border bg-surface/70 text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <Badge tone="accent" className="mb-4">
          {data.category}
        </Badge>
        <h2 id="project-modal-title" className="pr-10 text-h2 font-display font-semibold">
          {data.title}
        </h2>
        <p id="project-modal-desc" className="mt-4 text-body leading-relaxed text-muted">
          {data.description}
        </p>

        {data.highlights && data.highlights.length > 0 && (
          <div className="mt-6">
            <h3 className="eyebrow mb-3">Impact</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-foreground"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="eyebrow mb-3">Built with</h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {(hasLive || hasCode) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {hasLive && (
              <Button href={data.link} external size="sm">
                <ExternalLink className="h-4 w-4" />
                Live project
              </Button>
            )}
            {hasCode && (
              <Button href={data.github!} external variant="secondary" size="sm">
                <Github className="h-4 w-4" />
                Source code
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </Modal>
  );
}
