import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { BackToTop } from '@/components/layout/BackToTop';
import { useHashScroll } from '@/hooks/useHashScroll';
import { scrollTo } from '@/utils/scroll';

/** App shell: global chrome around the routed page content. */
export function RootLayout({ children }: { children: ReactNode }) {
  useHashScroll();
  const { pathname, hash } = useLocation();

  // Reset to the top on route change (react-router v6 doesn't); hash jumps are
  // handled by useHashScroll instead.
  useEffect(() => {
    if (!hash) scrollTo(0, { immediate: true });
  }, [pathname, hash]);

  return (
    <>
      <SkipToContent />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
