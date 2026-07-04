import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { GradientText } from '@/components/ui/GradientText';
import { useBlogs } from '@/hooks/useContent';
import { formatDate } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/animations/variants';

/** Excerpt = the hook's first paragraph, emphasis markers stripped. */
function excerpt(hook: string): string {
  return (hook.split(/\n{2,}/)[0] ?? '').replace(/\*/g, '');
}

export default function BlogsPage() {
  const blogs = useBlogs();

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
          <h1 className="text-display font-display font-semibold tracking-tight">
            <GradientText>My Blogs</GradientText>
          </h1>
          <p className="text-lead text-muted">
            Field notes on building production AI systems - agentic patterns, ML infrastructure, and the
            unglamorous parts that actually ship.
          </p>
        </div>

        {/* Grid */}
        {blogs.length === 0 ? (
          <GlassCard className="mt-12 text-center text-muted">
            No posts yet - check back soon.
          </GlassCard>
        ) : (
          <motion.ul
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((b) => (
              <motion.li key={b.id} variants={fadeInUp} className="h-full">
                <Link to={`/blogs/${b.meta.slug}`} className="group block h-full">
                  <GlassCard interactive className="flex h-full flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone="accent">{b.meta.category}</Badge>
                      <time dateTime={b.meta.date} className="text-xs text-subtle">
                        {formatDate(b.meta.date)}
                      </time>
                    </div>
                    <h2 className="text-h3 font-display font-medium leading-snug transition-colors group-hover:text-accent">
                      {b.meta.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                      {excerpt(b.content.hook)}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {b.meta.tags.slice(0, 3).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                      <span className="text-subtle">{b.meta.read_time_minutes} min read</span>
                      <span className="flex items-center gap-1 font-medium text-accent">
                        Read
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </Container>
    </div>
  );
}
