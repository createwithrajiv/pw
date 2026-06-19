import { useEffect } from 'react';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';

/** Lock page scroll (and pause Lenis) while `locked` is true — for modals/drawers. */
export function useLockBodyScroll(locked: boolean) {
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stop();
    return () => {
      document.body.style.overflow = previous;
      start();
    };
  }, [locked, stop, start]);
}
