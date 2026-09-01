import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollTo } from '@/utils/scroll';

/** On load / hash change, scroll to the targeted section (deep links). */
export function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    // Wait a frame so the target section has mounted.
    const id = window.requestAnimationFrame(() => {
      if (document.querySelector(hash)) scrollTo(hash);
    });
    return () => window.cancelAnimationFrame(id);
  }, [hash]);
}
