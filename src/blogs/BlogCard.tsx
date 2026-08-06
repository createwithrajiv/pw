import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { BlogCover } from './BlogCover';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { useProfile } from '@/hooks/useContent';
import { formatDate } from '@/utils/format';
import { excerpt } from '@/utils/excerpt';
import { cn } from '@/utils/cn';
import type { Blog } from '@/types';

interface BlogCardProps {
  blog: Blog;
  /** Large, image-led, two-column treatment for the lead post. */
  featured?: boolean;
  className?: string;
}

/**
 * The single blog card — used by the listing grid, the featured hero, and
 * "Read next". Cover thumbnail (or gradient fallback), category, title, excerpt,
 * tags, author + read time. One source so every surface stays consistent.
 */
export function BlogCard({ blog, featured = false, className }: BlogCardProps) {
  const { meta, content } = blog;
  const profile = useProfile();

  return (
    <Link
      to={`/blogs/${meta.slug}`}
      className={cn(
        'group panel relative flex overflow-hidden rounded-lg',
        'transition-[transform,box-shadow,border-color] duration-300 will-change-transform',
        'hover:-translate-y-1 hover:border-accent hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        featured ? 'flex-col lg:flex-row' : 'flex-col',
        className,
      )}
    >
      {/* Cover */}
      <div className={cn('relative shrink-0 overflow-hidden', featured && 'lg:w-[54%]')}>
        <BlogCover
          variant={featured ? 'card' : 'thumb'}
          cover={meta.cover}
          title={meta.title}
          category={meta.category}
          className={cn(
            'transition-transform duration-500 ease-out group-hover:scale-[1.03]',
            featured && 'lg:h-full lg:aspect-auto',
          )}
        />
      </div>

      {/* Body */}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-3',
          featured ? 'p-7 sm:p-8 lg:p-10' : 'p-6',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <Badge tone="accent">{meta.category}</Badge>
          <time dateTime={meta.date} className="shrink-0 text-xs text-subtle">
            {formatDate(meta.date)}
          </time>
        </div>

        <h3
          className={cn(
            'text-balance font-sans font-semibold tracking-tight transition-colors group-hover:text-accent',
            featured
              ? 'text-[clamp(1.5rem,1.1rem+1.5vw,2.15rem)] leading-[1.14]'
              : 'text-h3 leading-snug',
          )}
        >
          {meta.title}
        </h3>

        <p
          className={cn(
            'text-pretty leading-relaxed text-muted',
            featured ? 'line-clamp-3 text-[0.95rem] sm:line-clamp-4' : 'line-clamp-3 text-sm',
          )}
        >
          {excerpt(content.hook)}
        </p>

        {meta.tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {meta.tags.slice(0, featured ? 4 : 3).map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={profile.image}
              alt=""
              loading="lazy"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border"
            />
            <span className="truncate text-xs text-subtle">{profile.name}</span>
            <span className="text-border-strong" aria-hidden>
              &middot;
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-subtle">
              <Clock className="h-3 w-3" aria-hidden />
              {meta.read_time_minutes} min
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
            Read
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
