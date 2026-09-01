import { useEffect, useState } from 'react';
import { NAV_H_FALLBACK, navHeight } from '@/utils/scroll';

/**
 * Scrollspy driving the nav and the scroll rail.
 *
 * Deterministic by design: rather than asking IntersectionObserver which
 * sections happen to cross a band, it picks the last section whose top has
 * passed a reference line just under the sticky navbar. That line is the same
 * one `scroll-margin-top` uses, so clicking a nav item lands the section
 * exactly on its own activation point — no drift between click and highlight.
 *
 * Returns '' while the reader is above the first tracked section (the hero is
 * not a nav item, so nothing should be highlighted there).
 *
 * Ids must be in document order, which `useNavSections` guarantees.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('');
  const key = ids.join('|');

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;

    const compute = () => {
      frame = 0;
      const line = window.scrollY + (navHeight() || NAV_H_FALLBACK) + 1;
      const doc = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;

      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
        else break; // document order — nothing further can qualify
      }

      // A short final section may never push its top above the line. Once the
      // page can't scroll further, it is unambiguously the one being read.
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          if (document.getElementById(ids[i])) {
            current = ids[i];
            break;
          }
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Sections mount lazily; re-measure once the layout has settled.
    const settle = window.setTimeout(compute, 600);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}
