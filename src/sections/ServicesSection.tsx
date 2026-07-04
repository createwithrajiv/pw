import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useServices } from '@/hooks/useContent';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { burstVariant, staggerContainer } from '@/animations/variants';
import { cn } from '@/utils/cn';

export default function ServicesSection() {
  const services = useServices();
  const spotlight = useSpotlight();
  const reduced = useReducedMotion();

  return (
    <Section id="services" ambient={{ density: 'sparse' }}>
      <Container>
        <SectionHeading
          eyebrow="What I do"
          title="Services built for scale"
          subtitle="End-to-end ownership — from architecture to deployment, monitoring, and the latency budget."
        />
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={burstVariant(i, reduced)}
              data-cursor
              className={cn(
                'h-full transition-[opacity,filter] duration-300',
                spotlight.dimmed(i) && 'opacity-50 saturate-50',
              )}
              {...spotlight.bind(i)}
            >
              <TiltCard className="flex h-full flex-col gap-4 p-6">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-grad-accent/10 text-accent ring-1 ring-accent/20 transition-[transform,color] duration-300 group-hover:scale-105 group-hover:text-accent-2">
                  <IconRenderer name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-h3 font-display font-medium leading-snug">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{service.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
