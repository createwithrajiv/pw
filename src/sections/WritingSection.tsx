import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { useWriting } from '@/hooks/useContent';
import { formatDate } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/animations/variants';

/**
 * Writing lives on the newsletter, not here — this section is a shopfront for
 * it: the most recent posts, each linking out, plus a subscribe CTA so a reader
 * who likes the work has somewhere to go.
 */
export default function WritingSection() {
  const { newsletter, posts } = useWriting();
  if (posts.length === 0) return null;

  return (
    <Section id="writing">
      <Container>
        <SectionHeading
          eyebrow="Writing"
          title={newsletter.name}
          subtitle={`${newsletter.tagline} Production notes on models, agents, databases, and what happens to all of it at scale.`}
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.a
              key={post.url}
              variants={fadeInUp}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card interactive className="flex h-full flex-col gap-3 p-6">
                <time dateTime={post.date} className="text-xs text-subtle">
                  {formatDate(post.date)}
                </time>
                <h3 className="text-h3 font-sans font-medium leading-snug transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Read on {newsletter.name}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Card>
            </motion.a>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span aria-hidden className="mt-0.5 text-accent">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-sans font-medium">Get new posts by email</p>
              <p className="text-sm text-muted">
                Occasional, technical, no spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
          <Button href={newsletter.subscribeUrl} external className="shrink-0">
            Subscribe
          </Button>
        </div>
      </Container>
    </Section>
  );
}
