import { Suspense } from 'react';
import { Seo } from '@/components/seo/Seo';
import { useSections } from '@/hooks/useSections';

/**
 * The page is composed dynamically from the resolved section list — order,
 * enablement and emptiness all come from website-settings.json + the data,
 * so editing JSON reshapes the page with zero code changes.
 */
export default function HomePage() {
  const sections = useSections();

  return (
    <>
      <Seo />
      {sections.map(({ id, entry }) => {
        const SectionComponent = entry.Component;
        return (
          <Suspense key={id} fallback={<div className="min-h-[40vh]" aria-hidden />}>
            <SectionComponent />
          </Suspense>
        );
      })}
    </>
  );
}
