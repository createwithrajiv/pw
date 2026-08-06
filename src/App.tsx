import { lazy, Suspense, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import { FxProvider } from '@/providers/FxProvider';
import { RootLayout } from '@/layouts/RootLayout';
import { RouteSkeleton } from '@/blogs/BlogSkeleton';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));

/** A light opacity fade on each route change so navigation reads as intentional. */
function RouteFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ReducedMotionProvider>
          <BrowserRouter>
            <FxProvider>
              <RootLayout>
                <Suspense fallback={<RouteSkeleton />}>
                  <RouteFade>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/blogs" element={<BlogsPage />} />
                      <Route path="/blogs/:slug" element={<BlogPostPage />} />
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </RouteFade>
                </Suspense>
              </RootLayout>
            </FxProvider>
          </BrowserRouter>
        </ReducedMotionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
