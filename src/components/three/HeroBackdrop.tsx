import { HeroGradient } from './HeroGradient';
import { HeroAtmosphere } from '@/components/hero/HeroAtmosphere';

/**
 * Hero background CSS bed: a static gradient + atmosphere that paints instantly
 * and is the always-present fallback. The hero's 3D particle constellation now
 * lives in the single persistent world canvas (CanvasRoot → HeroZone), framed at
 * the origin by the camera's start keyframe — so this component is purely the
 * DOM/CSS layer that every tier (including no-WebGL / reduced-motion) shares.
 */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10">
      <HeroGradient />
      <HeroAtmosphere />
    </div>
  );
}
