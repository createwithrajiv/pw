import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { useCompanyLogos } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import type { Company } from '@/types';

function LogoChip({ company }: { company: Company }) {
  const chip = (
    <div className="flex h-16 items-center justify-center px-5">
      <img
        src={company.logo}
        alt={company.name}
        loading="lazy"
        decoding="async"
        width={130}
        height={36}
        className="max-h-9 w-auto max-w-[130px] object-contain grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-0 dark:invert"
      />
    </div>
  );

  if (company.website) {
    return (
      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${company.name} website`}
               className="group block"
      >
        {chip}
      </a>
    );
  }
  return (
    <div className="group block" aria-label={company.name}>
      {chip}
    </div>
  );
}

/** Compact "trusted by" strip: all company logos, static and always visible. */
export default function LogosSection() {
  const logos = useCompanyLogos();
  if (logos.length === 0) return null;

  return (
    <Section id="logos" className="!py-16">
      <Container>
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          <motion.p variants={fadeInUp} className="eyebrow text-center">
            Experience across teams at
          </motion.p>
          <motion.ul
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {logos.map((c) => (
              <li key={c.name}>
                <LogoChip company={c} />
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </Section>
  );
}
