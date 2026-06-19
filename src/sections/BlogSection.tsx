import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tag } from '@/components/ui/Tag';
import { useBlog, usePublishedPosts } from '@/hooks/useContent';
import { isRealHref } from '@/utils/href';
import { formatDate } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function BlogSection() {
  const blog = useBlog();
  const posts = usePublishedPosts();
  if (posts.length === 0) return null;

  return (
    <Section id="blog">
      <Container>
        <SectionHeading eyebrow={blog.eyebrow ?? 'Writing'} title={blog.heading} />
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => {
            const Wrapper = isRealHref(post.url) ? motion.a : motion.div;
            return (
              <Wrapper
                key={post.slug}
                variants={fadeInUp}
                {...(isRealHref(post.url)
                  ? { href: post.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                data-cursor
              >
                <GlassCard interactive className="flex h-full flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 text-xs text-subtle">
                    <time>{formatDate(post.date)}</time>
                    {post.readingTime && <span>· {post.readingTime}</span>}
                  </div>
                  <h3 className="text-h3 font-display font-medium leading-snug transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  {isRealHref(post.url) && (
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Read <ArrowUpRight className="h-4 w-4" />
                    </span>
                  )}
                </GlassCard>
              </Wrapper>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
