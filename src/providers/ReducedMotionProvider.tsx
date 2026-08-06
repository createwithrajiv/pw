import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

const MotionContext = createContext(false);
const QUERY = '(prefers-reduced-motion: reduce)';

function systemReduced(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Follows the operating system's reduced-motion setting — nothing else.
 *
 * There is deliberately no in-app override: the OS preference is the accessible
 * source of truth, and the previous three-state control both defaulted to
 * "reduced" for every first-time visitor and could never be returned to
 * "follow system" once touched.
 */
export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState<boolean>(systemReduced);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <MotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

/** Central motion gate. Returns true when large motion should be avoided. */
export function useReducedMotion(): boolean {
  return useContext(MotionContext);
}
