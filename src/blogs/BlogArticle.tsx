import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { Reveal } from '@/components/motion/Reveal';
import { MarkdownLite } from './MarkdownLite';
import { formatDate } from '@/utils/format';
import { isRealHref } from '@/utils/href';
import type { Blog } from '@/types';

/**
 * The shared, default article layout — renders any blog straight from its JSON.
 * A per-blog folder (src/blogs/<id>/index.tsx) can override this to customize a
 * specific article; by default it just re-exports this component.
 */
export default function BlogArticle({ blog }: { blog: Blog }) {
  const { meta, content, cta } = blog;

  return (
    <article className="relative pt-28 pb-24">
      <Container width="narrow">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All blogs
        </Link>

        {/* Header */}
        <Reveal as="div" className="mt-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge tone="accent">{meta.category}</Badge>
            <span className="text-sm text-subtle">
              <time dateTime={meta.date}>{formatDate(meta.date)}</time> · {meta.read_time_minutes} min
              read · {meta.author}
            </span>
          </div>
          <h1 className="text-[clamp(2rem,1.4rem+2.6vw,3.25rem)] font-display font-semibold leading-[1.12] tracking-tight text-balance">
            <GradientText>{meta.title}</GradientText>
          </h1>
          {meta.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {meta.tags.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        {/* Hook / lead */}
        <Reveal as="div" className="mt-10 flex flex-col gap-5 text-lead leading-relaxed text-muted">
          <MarkdownLite text={content.hook} />
        </Reveal>

        {/* Body sections */}
        <div className="flex flex-col">
          {content.sections.map((section, i) => (
            <Reveal as="section" key={i} className="mt-12 flex flex-col gap-4">
              <h2 className="text-h2 font-display font-semibold tracking-tight">{section.heading}</h2>
              {section.body && (
                <div className="flex flex-col gap-5 text-body leading-relaxed text-muted">
                  <MarkdownLite text={section.body} />
                </div>
              )}
              {section.subsections?.map((sub, j) => (
                <div key={j} className="mt-4 flex flex-col gap-3">
                  <h3 className="text-h3 font-display font-medium tracking-tight text-foreground">
                    {sub.subheading}
                  </h3>
                  <div className="flex flex-col gap-5 text-body leading-relaxed text-muted">
                    <MarkdownLite text={sub.body} />
                  </div>
                </div>
              ))}
            </Reveal>
          ))}
        </div>

        {/* Closing */}
        {content.closing && (
          <Reveal as="div" className="mt-14">
            <div className="glass flex flex-col gap-5 rounded-xl p-6 text-body leading-relaxed text-foreground sm:p-8">
              <MarkdownLite text={content.closing} />
            </div>
          </Reveal>
        )}

        {/* CTA */}
        <Reveal as="div" className="mt-10 flex flex-col gap-5">
          {cta.primary && <p className="text-lead text-muted">{cta.primary}</p>}
          <div className="flex flex-wrap gap-3">
            {Object.entries(cta.links).map(([platform, url]) =>
              isRealHref(url) ? (
                <Button key={platform} href={url as string} variant="secondary" size="sm">
                  <IconRenderer name={platform} className="h-4 w-4" />
                  <span className="capitalize">{platform}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              ) : null,
            )}
          </div>
        </Reveal>
      </Container>
    </article>
  );
}
