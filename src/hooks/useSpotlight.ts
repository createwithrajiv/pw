import { useState } from 'react';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

interface SpotlightBind {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

interface SpotlightResult {
  hovered: number | null;
  bind: (index: number) => SpotlightBind;
  /** True when a *different* item is focused/hovered (so this one should dim). */
  dimmed: (index: number) => boolean;
}

/**
 * Sibling-dimming "spotlight" for a grid: hovering/focusing one item dims the
 * rest. CSS-transition driven (no motion values). Keyboard parity via focus/blur.
 * No-op under reduced motion (`dimmed` always false).
 */
export function useSpotlight(): SpotlightResult {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  const bind = (index: number): SpotlightBind => ({
    onPointerEnter: () => setHovered(index),
    onPointerLeave: () => setHovered((h) => (h === index ? null : h)),
    onFocus: () => setHovered(index),
    onBlur: () => setHovered((h) => (h === index ? null : h)),
  });

  const dimmed = (index: number) => !reduced && hovered !== null && hovered !== index;

  return { hovered, bind, dimmed };
}
