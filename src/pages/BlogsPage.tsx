import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/blogs/BlogCard';
import { useBlogs } from '@/hooks/useContent';
import { fadeInUp } from '@/animations/variants';
import { excerpt } from '@/utils/excerpt';
import { cn } from '@/utils/cn';

export default function BlogsPage() {
  const blogs = useBlogs();
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((b) => b.meta.category)))],
    [blogs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((b) => {
      if (activeCategory !== 'All' && b.meta.category !== activeCategory) return false;
      if (!q) return true;
      const haystack = [b.meta.title, b.meta.category, ...b.meta.tags, excerpt(b.content.hook)]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [blogs, activeCategory, query]);

  const isBrowsingAll = activeCategory === 'All' && query.trim() === '';
  const featured = isBrowsingAll ? filtered[0] : undefined;
  const gridItems = featured ? filtered.slice(1) : filtered;
  const showControls = blogs.length > 1;

  const clearFilters = () => {
    setActiveCategory('All');
    setQuery('');
  };

  return (
    <div className="relative min-h-[70vh] pb-24 pt-32">
      <Seo
        title="My Blogs"
        description="Field notes on AI engineering, agentic systems, and building production AI - by Rajiv Yadav."
      />
      <Container>
        {/* Header */}
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="eyebrow flex items-center gap-2">
            <span className="inline-block h-px w-6 bg-accent/60" aria-hidden />
            Writing
          </p>
          <h1 className="text-display font-sans font-semibold tracking-tight">
            My Blogs
          </h1>
          <p className="text-lead text-muted">
            Field notes on building production AI systems - agentic patterns, ML infrastructure, and the
            unglamorous parts that actually ship.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="panel mt-12 rounded-2xl p-10 text-center text-muted">
            No posts yet - check back soon.
          </div>
        ) : (
          <>
            {/* Controls: category chips + search */}
            {showControls && (
              <div className="mt-10 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
                <div
                  role="tablist"
                  aria-label="Filter posts by category"
                  className="flex flex-wrap gap-2"
                >
                  {categories.map((cat) => {
                    const active = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          'rounded-md border px-3.5 py-1.5 text-sm transition-colors duration-200',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base',
                          active
                            ? 'border-accent/40 bg-accent/10 font-medium text-accent'
                            : 'border-border text-muted hover:border-accent/40 hover:text-foreground',
                        )}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <label className="group relative flex w-full items-center md:w-72">
                  <Search
                    className="pointer-events-none absolute left-3.5 h-4 w-4 text-subtle transition-colors group-focus-within:text-accent"
                    aria-hidden
                  />
                  <span className="sr-only">Search posts</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts..."
                    className={cn(
                      'w-full rounded-md border border-border bg-surface/60 py-2 pl-10 pr-9 text-sm text-foreground',
                      'placeholder:text-subtle transition-colors duration-200',
                      'focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20',
                    )}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 rounded-full p-0.5 text-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </label>
              </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="panel mt-12 flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
                <p className="text-muted">
                  No posts match{' '}
                  {query ? (
                    <>
                      &ldquo;<span className="text-foreground">{query}</span>&rdquo;
                    </>
                  ) : (
                    <span className="text-foreground">{activeCategory}</span>
                  )}
                  .
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-accent transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-10 flex flex-col gap-8">
                {/* Featured (latest) */}
                {featured && (
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeInUp}
                  >
                    <BlogCard blog={featured} featured />
                  </motion.div>
                )}

                {/* Grid */}
                {gridItems.length > 0 && (
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gridItems.map((b) => (
                      <motion.li
                        key={b.id}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={fadeInUp}
                        className="h-full"
                      >
                        <BlogCard blog={b} className="h-full" />
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
