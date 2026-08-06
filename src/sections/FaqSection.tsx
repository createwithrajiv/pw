import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { useFaq } from '@/hooks/useContent';

export default function FaqSection() {
  const faq = useFaq();
  const items = faq.items.map((item) => ({ title: item.question, content: item.answer }));

  return (
    <Section id="faq">
      <Container width="narrow">        <SectionHeading
          eyebrow={faq.eyebrow ?? 'Questions'}
          title={faq.heading}
          align="center"
        />
        <div className="mt-10">
          <Accordion items={items} accent />
        </div>
      </Container>
    </Section>
  );
}
