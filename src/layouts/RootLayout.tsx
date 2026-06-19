import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { BackToTop } from '@/components/layout/BackToTop';
import { StoryBackdrop } from '@/components/layout/StoryBackdrop';
import { useHashScroll } from '@/hooks/useHashScroll';

/** App shell: global chrome around the routed page content. */
export function RootLayout({ children }: { children: ReactNode }) {
  useHashScroll();

  return (
    <>
      <StoryBackdrop />
      <SkipToContent />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
