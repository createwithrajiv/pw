import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { useBlogs } from '@/hooks/useContent';
import { relatedPosts, adjacentPosts } from '@/utils/related';
import { cn } from '@/utils/cn';
import type { Blog } from '@/types';

/** Compact chronological pager card (older / newer). */
function Pager({ dir, blog }: { dir: 'prev' | 'next'; blog: Blog }) {
  const isPrev = dir === 'prev';
  return (
    <Link
      to={`/blogs/${blog.meta.slug}`}
      className={cn(
        'group panel flex flex-col gap-1.5 rounded-xl p-5 transition-colors duration-200 hover:border-accent/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        isPrev ? 'items-start text-left' : 'items-end text-right',
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-subtle">
        {isPrev && <ArrowLeft className="h-3.5 w-3.5" aria-hidden />}
        {isPrev ? 'Older' : 'Newer'}
        {!isPrev && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
      </span>
      <span className="line-clamp-2 font-sans font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
        {blog.meta.title}
      </span>
    </Link>
  );
}

/**
 * "Read next" — up to two scored-related posts, plus a chronological prev/next
 * pager once the blog is large enough for the pager to surface fresh posts.
 * Renders nothing when there's only one article.
 */
export function RelatedPosts({ current }: { current: Blog }) {
  const all = useBlogs();
  if (all.length <= 1) return null;

  const related = relatedPosts(all, current, 2);
  const { prev, next } = adjacentPosts(all, current);
  const showPager = all.length > 3 && (prev || next);

  return (
    <section aria-labelledby="read-next" className="mt-20 border-t border-border pt-12">
      <h2
        id="read-next"
        className="text-xs font-medium uppercase tracking-[0.18em] text-subtle"
      >
        Read next
      </h2>

      {related.length > 0 && (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {related.map((b) => (
            <li key={b.id} className="h-full">
              <BlogCard blog={b} className="h-full" />
            </li>
          ))}
        </ul>
      )}

      {showPager && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {prev ? <Pager dir="prev" blog={prev} /> : <span aria-hidden />}
          {next ? <Pager dir="next" blog={next} /> : <span aria-hidden />}
        </div>
      )}
    </section>
  );
}
