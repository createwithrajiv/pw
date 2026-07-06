import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';

export type MotionPreference = 'system' | 'on' | 'off';

interface MotionContextValue {
  /** Resolved decision: true => avoid large motion / 3D. */
  reduced: boolean;
  /** User-facing override; 'system' follows the OS setting. */
  preference: MotionPreference;
  setPreference: (p: MotionPreference) => void;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);
const STORAGE_KEY = 'motion-pref';
const QUERY = '(prefers-reduced-motion: reduce)';

function systemReduced(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<MotionPreference>(() => {
    if (typeof window === 'undefined') return 'on';
    return (localStorage.getItem(STORAGE_KEY) as MotionPreference | null) ?? 'on';
  });
  const [systemValue, setSystemValue] = useState<boolean>(systemReduced);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setSystemValue(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const reduced = preference === 'on' ? true : preference === 'off' ? false : systemValue;

  const setPreference = useCallback((p: MotionPreference) => {
    setPreferenceState(p);
    localStorage.setItem(STORAGE_KEY, p);
  }, []);

  const toggle = useCallback(() => {
    setPreference(reduced ? 'off' : 'on');
  }, [reduced, setPreference]);

  const value = useMemo<MotionContextValue>(
    () => ({ reduced, preference, setPreference, toggle }),
    [reduced, preference, setPreference, toggle],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

/** Central motion gate. Returns true when large motion / 3D should be avoided. */
export function useReducedMotion(): boolean {
  const ctx = useContext(MotionContext);
  return ctx?.reduced ?? false;
}

/** Full control of the motion preference (for an in-UI toggle). */
export function useMotionPreference(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotionPreference must be used within ReducedMotionProvider');
  return ctx;
}
