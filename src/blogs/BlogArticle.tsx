import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Clock, Hash, List } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { Reveal } from '@/components/motion/Reveal';
import { MarkdownBody } from './MarkdownBody';
import { BlogCover } from './BlogCover';
import { ShareBar } from './ShareBar';
import { RelatedPosts } from './RelatedPosts';
import { useProfile } from '@/hooks/useContent';
import { scrollTo } from '@/utils/scroll';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useCopy } from '@/hooks/useCopy';
import { formatDate } from '@/utils/format';
import { isRealHref } from '@/utils/href';
import { uniqueSlugs, slugify } from '@/utils/slug';
import { cn } from '@/utils/cn';
import type { Blog } from '@/types';

/** Hover-revealed permalink beside a heading — copies the deep link and smooth-scrolls to it. */
function HeadingAnchor({ id }: { id: string }) {
  const { copied, copy } = useCopy();
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(`#${id}`);
        copy(`${window.location.origin}${window.location.pathname}#${id}`);
        history.replaceState(null, '', `#${id}`);
      }}
      aria-label={copied ? 'Link copied' : 'Copy link to this section'}
      className="inline-flex shrink-0 items-center self-center rounded text-subtle opacity-0 transition-opacity duration-200 hover:text-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group-hover/heading:opacity-100"
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" aria-hidden />
      ) : (
        <Hash className="h-4 w-4" aria-hidden />
      )}
    </a>
  );
}

/**
 * The shared, default article layout — a focused, editorial reading experience:
 * author byline, numbered sections, a sticky
 * table of contents on wide screens, and an author CTA. A per-blog folder can
 * override this; by default it re-exports this component.
 */
export default function BlogArticle({ blog }: { blog: Blog }) {
  const { meta, content, cta } = blog;
  const profile = useProfile();

  // Stable, human-readable anchor ids shared by the TOC, scroll-spy, and permalinks.
  const sectionIds = uniqueSlugs(content.sections.map((s) => s.heading));
  const toc = content.sections.map((s, i) => ({ id: sectionIds[i], label: s.heading }));
  const active = useActiveSection(toc.map((t) => t.id));

  return (
    <>
      <article className="relative pb-28 pt-24">
        <Container width="default">
          {/* Breadcrumb + cover banner */}
          <div className="mx-auto max-w-[64rem]">
            <nav aria-label="Breadcrumb" className="text-sm">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All blogs
              </Link>
              <span className="mx-2 text-border-strong">/</span>
              <span className="text-subtle">{meta.category}</span>
            </nav>
            <BlogCover
              variant="hero"
              cover={meta.cover}
              title={meta.title}
              category={meta.category}
              className="mt-5 rounded-2xl border border-border"
            />
          </div>

          <div className="mx-auto mt-10 grid max-w-[44rem] grid-cols-1 gap-x-16 xl:max-w-[64rem] xl:grid-cols-[minmax(0,1fr)_13rem]">
            {/* ---- Reading column ---- */}
            <div className="min-w-0">
              {/* Header */}
              <Reveal as="header" className="mt-7 flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="accent">{meta.category}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-sm text-subtle">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {meta.read_time_minutes} min read
                  </span>
                </div>

                <h1 className="text-balance text-[clamp(2.1rem,1.3rem+2.9vw,3.4rem)] font-sans font-semibold leading-[1.1] tracking-tight">
                  {meta.title}
                </h1>

                {/* Byline */}
                <div className="flex items-center gap-3">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    loading="eager"
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{profile.name}</span>
                    <time dateTime={meta.date} className="text-xs text-subtle">
                      {formatDate(meta.date)}
                    </time>
                  </div>
                </div>

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

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-border-strong to-transparent" />
                <ShareBar title={meta.title} snippets={meta.social_snippets} />
              </div>

              {/* Lead / hook */}
              <Reveal as="div" className="prose prose-blog prose-lg mt-9 max-w-none">
                <MarkdownBody text={content.hook} />
              </Reveal>

              {/* Contents (mobile / tablet) — desktop uses the sticky rail instead */}
              {toc.length > 1 && (
                <details className="group/toc mt-9 overflow-hidden rounded-xl border border-border bg-surface/30 xl:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-2">
                      <List className="h-4 w-4 text-accent" aria-hidden />
                      Contents
                    </span>
                    <ChevronDown
                      className="h-4 w-4 text-subtle transition-transform duration-200 group-open/toc:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <nav aria-label="On this page" className="border-t border-border p-2">
                    <ol className="flex flex-col">
                      {toc.map((t, i) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo(`#${t.id}`);
                              history.replaceState(null, '', `#${t.id}`);
                            }}
                            className="flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:bg-surface focus-visible:text-foreground focus-visible:outline-none"
                          >
                            <span className="font-mono text-xs text-subtle">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span>{t.label}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              )}

              {/* Sections */}
              {content.sections.map((section, i) => (
                <Reveal
                  as="section"
                  key={i}
                  id={sectionIds[i]}
                  className="mt-14 scroll-mt-28 flex flex-col gap-5"
                >
                  <div className="group/heading flex items-baseline gap-3.5">
                    <span className="font-mono text-sm font-medium text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-h2 font-sans font-semibold tracking-tight">
                      {section.heading}
                    </h2>
                    <HeadingAnchor id={sectionIds[i]} />
                  </div>

                  {section.body && (
                    <div className="prose prose-blog max-w-none">
                      <MarkdownBody text={section.body} />
                    </div>
                  )}

                  {section.subsections?.map((sub, j) => {
                    const subId = `${sectionIds[i]}-${slugify(sub.subheading)}`;
                    return (
                      <div
                        key={j}
                        id={subId}
                        className="mt-4 flex scroll-mt-28 flex-col gap-3 border-l-2 border-accent/30 pl-5"
                      >
                        <div className="group/heading flex items-baseline gap-2.5">
                          <h3 className="text-h3 font-sans font-medium tracking-tight text-foreground">
                            {sub.subheading}
                          </h3>
                          <HeadingAnchor id={subId} />
                        </div>
                        <div className="prose prose-blog max-w-none">
                          <MarkdownBody text={sub.body} />
                        </div>
                      </div>
                    );
                  })}
                </Reveal>
              ))}

              {/* Closing callout */}
              {content.closing && (
                <Reveal as="div" className="mt-16">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-7 sm:p-9">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-1 -top-8 select-none font-sans text-[8rem] leading-none text-accent/10"
                    >
                      &ldquo;
                    </span>
                    <div className="prose prose-blog relative max-w-none">
                      <MarkdownBody text={content.closing} />
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Share (foot) */}
              <div className="mt-10 flex items-center gap-4 border-t border-border pt-8">
                <ShareBar title={meta.title} snippets={meta.social_snippets} />
              </div>

              {/* Author + CTA */}
              <Reveal as="div" className="mt-12">
                <div className="panel flex flex-col gap-5 rounded-2xl p-7 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-foreground">{profile.name}</span>
                      <span className="text-sm text-subtle">{profile.title}</span>
                    </div>
                    {cta.primary && <p className="text-sm leading-relaxed text-muted">{cta.primary}</p>}
                    <div className="flex flex-wrap gap-2.5">
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
                  </div>
                </div>
              </Reveal>

              {/* Read next */}
              <RelatedPosts current={blog} />

              {/* Footer nav */}
              <div className="mt-12 border-t border-border pt-8">
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to all blogs
                </Link>
              </div>
            </div>

            {/* ---- Sticky table of contents (wide screens) ---- */}
            {toc.length > 1 && (
              <aside className="hidden xl:block">
                <nav aria-label="On this page" className="sticky top-28 flex flex-col gap-3">
                  <span className="eyebrow text-subtle">On this page</span>
                  <ul className="flex flex-col">
                    {toc.map((t, i) => (
                      <li key={t.id}>
                        <button
                          onClick={() => {
                            scrollTo(`#${t.id}`);
                            history.replaceState(null, '', `#${t.id}`);
                          }}
                          aria-current={active === t.id ? 'true' : undefined}
                          className={cn(
                            '-ml-px flex w-full items-baseline gap-2 border-l-2 py-1.5 pl-4 text-left text-sm transition-colors',
                            'rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                            active === t.id
                              ? 'border-accent text-foreground'
                              : 'border-border text-muted hover:border-accent hover:text-foreground',
                          )}
                        >
                          <span className="font-mono text-xs text-subtle">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="line-clamp-2">{t.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}
