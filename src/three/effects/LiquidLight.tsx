import { FxPlane } from '@/components/three/FxPlane';
import type { FxSignals } from '@/providers/FxProvider';

/**
 * Fullscreen additive "liquid light" backdrop. Its vertex shader writes clip
 * space directly, so it is camera-independent and always covers the viewport
 * behind the travelling world. Reuses the existing fx shader; Phase 3 relocates
 * the GLSL here and feeds it theme-reactive color uniforms.
 */
export function LiquidLight({ fx }: { fx: FxSignals }) {
  return <FxPlane fx={fx} />;
}
