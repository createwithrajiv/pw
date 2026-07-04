import { create } from 'zustand';

export type QualityTier = 'full' | 'lite' | 'off';

/**
 * Discrete, re-render-worthy state for the 3D world. Readable INSIDE the R3F
 * canvas (unlike React context, which can't cross the Canvas boundary).
 *
 * High-frequency signals (scroll/velocity/cursor) deliberately stay as Framer
 * MotionValues on the FxProvider bus and are read imperatively in useFrame — they
 * must never be pushed through this store (per-frame set() would thrash React).
 */
interface ExperienceState {
  /** Live render quality — starts at `full`, downgraded by PerformanceMonitor. */
  qualityTier: QualityTier;
  /** Active section id (scrollspy) — reserved for world emphasis / nav sync. */
  activeSection: string;
  setQualityTier: (tier: QualityTier) => void;
  setActiveSection: (id: string) => void;
}

export const useExperienceStore = create<ExperienceState>()((set) => ({
  qualityTier: 'full',
  activeSection: 'hero',
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setActiveSection: (activeSection) => set({ activeSection }),
}));
