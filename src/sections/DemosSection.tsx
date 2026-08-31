import { motion } from 'framer-motion';
import { ArrowUpRight, Lock, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { useDemos, useProfile } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';

/**
 * Walkthroughs of NDA'd client work.
 *
 * The links are deliberately in the markup rather than hidden: hiding them in
 * the client bundle would be theatre, since anything the page knows the visitor
 * can read. The real access control is YouTube's — every recording is set to
 * Private, so the URL alone grants nothing without an approved Google account.
 * Visitors see the constraint stated plainly and a way to ask; the owner gets a
 * one-click jump.
 */
export default function DemosSection() {
  const { notice, items } = useDemos();
  const profile = useProfile();
  if (items.length === 0) return null;

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    'Request: product walkthrough access',
  )}&body=${encodeURIComponent(
    "Hi Rajiv,\n\nI'd like to see a walkthrough of your production work.\n\n",
  )}`;

  return (
    <Section id="demos" band>
      <Container>
        <SectionHeading
          eyebrow="Demos"
          title="Product walkthroughs"
          subtitle={notice}
        />

        <div className="mt-8">
          <Button href={mailto}>
            <Mail className="h-4 w-4" />
            Request access
          </Button>
        </div>

        <motion.ul
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((demo) => (
            <motion.li key={demo.url} variants={fadeInUp}>
              <Card className="flex h-full flex-col gap-3 p-6">
                {demo.duration && <span className="text-xs text-subtle">{demo.duration}</span>}
                <h3 className="text-h3 font-sans font-medium leading-snug">{demo.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted">{demo.summary}</p>
                {demo.tags && demo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {demo.tags.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Private recording
                  </span>
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`Open the ${demo.title} recording on YouTube (requires approved access)`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Open
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
