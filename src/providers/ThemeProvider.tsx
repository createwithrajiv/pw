import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { settings } from '@/data';
import type { ThemeMode } from '@/types';

const STORAGE_KEY = 'theme';

interface ThemeContextValue {
  mode: ThemeMode; // 'light' | 'dark' | 'system'
  resolved: 'light' | 'dark';
  setMode: (m: ThemeMode) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyClass(resolved: 'light' | 'dark') {
  const el = document.documentElement;
  el.classList.toggle('dark', resolved === 'dark');
  el.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return settings.themeDefault;
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? settings.themeDefault;
  });
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  const resolved: 'light' | 'dark' =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    applyClass(resolved);
  }, [resolved]);

  // Live-follow the OS preference while in 'system' mode.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  // light -> dark -> system -> light. The previous version flipped between the
  // two resolved values only, so once a visitor touched it 'system' became
  // unreachable and the OS preference was ignored forever.
  const cycle = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, cycle }),
    [mode, resolved, setMode, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
