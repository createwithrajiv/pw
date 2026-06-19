import { motion } from 'framer-motion';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useCertifications } from '@/hooks/useContent';
import { isRealHref } from '@/utils/href';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function CertificationsSection() {
  const certifications = useCertifications();
  if (certifications.length === 0) return null;

  return (
    <Section id="certifications">
      <Container>
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          subtitle="Verified, ongoing investment in the craft."
        />
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certifications.map((cert) => (
            <motion.div key={`${cert.title}-${cert.issuer}`} variants={fadeInUp}>
              <GlassCard interactive className="flex h-full items-start gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-grad-accent/10 text-accent ring-1 ring-accent/20">
                  <IconRenderer name={cert.icon ?? 'award'} className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-medium leading-snug">{cert.title}</h3>
                  <p className="text-sm text-muted">{cert.issuer}</p>
                  <p className="text-xs text-subtle">{cert.issuedDate}</p>
                  {isRealHref(cert.credentialUrl) && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline mt-1 inline-flex w-fit items-center gap-1 text-xs text-accent"
                    >
                      <BadgeCheck className="h-3.5 w-3.5" /> Verify
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
