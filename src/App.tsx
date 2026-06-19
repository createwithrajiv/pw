import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { RootLayout } from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ReducedMotionProvider>
          <BrowserRouter>
            <SmoothScrollProvider>
              <RootLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </RootLayout>
            </SmoothScrollProvider>
          </BrowserRouter>
        </ReducedMotionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
