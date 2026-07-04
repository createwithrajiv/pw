import { useEffect, useState } from 'react';

/**
 * False during SSR / the first client render, true after mount. Gate every
 * `<Canvas>` behind this so WebGL never renders server-side (SSG-safe) and the
 * prerendered HTML contains only the DOM + CSS fallbacks.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
