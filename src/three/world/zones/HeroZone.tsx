import { ParticleField } from '@/components/three/ParticleField';
import { useExperienceStore } from '@/store/experienceStore';
import type { WorldPalette } from '../palette';

/**
 * The hero constellation, anchored at the world origin — framed by the camera's
 * start pose (z 8, looking inward), then flown through as you scroll deeper. Only
 * the particle COUNT scales with the tier; the network lattice stays on so a FPS
 * dip never guts the scene.
 */
export function HeroZone({ palette }: { palette: WorldPalette }) {
  const tier = useExperienceStore((s) => s.qualityTier);
  const count = tier === 'full' ? 3200 : 1600;
  return <ParticleField count={count} network palette={palette} />;
}
