import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';

/** On load / hash change, smooth-scroll to the targeted section (deep links). */
export function useHashScroll() {
  const { hash } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!hash) return;
    // Wait a frame so the target section has mounted.
    const id = window.requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) scrollTo(hash);
    });
    return () => window.cancelAnimationFrame(id);
  }, [hash, scrollTo]);
}
