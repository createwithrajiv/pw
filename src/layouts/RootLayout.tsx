import { useEffect, type ReactNode } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { BackToTop } from '@/components/layout/BackToTop';
import { StoryBackdrop } from '@/components/layout/StoryBackdrop';
import { useHashScroll } from '@/hooks/useHashScroll';
import { useFxSignals } from '@/hooks/useFxSignals';
import { scrollTo } from '@/utils/scroll';

/** App shell: global chrome around the routed page content. */
export function RootLayout({ children }: { children: ReactNode }) {
  useHashScroll();
  const fx = useFxSignals();
  const { pathname, hash } = useLocation();
  const onBlog = pathname.startsWith('/blogs');
  const chromaOpacity = useTransform(fx.velocityAbs, [0, 1], [0, 0.06]);

  // Reset to the top on route change (react-router v6 doesn't); hash jumps are
  // handled by useHashScroll instead.
  useEffect(() => {
    if (!hash) scrollTo(0, { immediate: true });
  }, [pathname, hash]);

  return (
    <>
      <StoryBackdrop />
      {!fx.reduced && !onBlog && (
        <motion.div
          aria-hidden
          style={{
            opacity: chromaOpacity,
            background:
              'linear-gradient(110deg, hsl(var(--accent) / 0.5), transparent 42%, transparent 58%, hsl(var(--accent-3) / 0.5))',
          }}
          className="pointer-events-none fixed inset-0 -z-10 mix-blend-screen"
        />
      )}
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
