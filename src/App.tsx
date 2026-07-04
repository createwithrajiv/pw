import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { FxProvider } from '@/providers/FxProvider';
import { RootLayout } from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ReducedMotionProvider>
          <BrowserRouter>
            <SmoothScrollProvider>
              <FxProvider>
                <RootLayout>
                  <Suspense fallback={<div className="min-h-[100svh]" aria-hidden />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/blogs" element={<BlogsPage />} />
                      <Route path="/blogs/:slug" element={<BlogPostPage />} />
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                </RootLayout>
              </FxProvider>
            </SmoothScrollProvider>
          </BrowserRouter>
        </ReducedMotionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
