import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useServices, useSectionCopy } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function ServicesSection() {
  const services = useServices();
  const copy = useSectionCopy('services');
  return (
    <Section id="services" band>
      <Container>
        <SectionHeading {...copy} />
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              data-cursor
              className="h-full"
            >
              <GlassCard className="flex h-full flex-col gap-4 p-6">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-accent/10 text-accent ring-1 ring-accent/20 transition-[transform,color] duration-300 group-hover:scale-105 group-hover:text-accent">
                  <IconRenderer name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-h3 font-sans font-medium leading-snug">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{service.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
