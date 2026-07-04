import { ParticleField } from '@/components/three/ParticleField';
import { useExperienceStore } from '@/store/experienceStore';

/**
 * The hero constellation, anchored at the world origin — framed by the camera's
 * start keyframe (position [0,0,6], looking at origin) so it reads exactly like
 * the old hero, then recedes as the camera descends on scroll. Particle density
 * and the neural-network layer scale with the live quality tier.
 */
export function HeroZone() {
  const tier = useExperienceStore((s) => s.qualityTier);
  const count = tier === 'full' ? 3200 : 1400;
  const network = tier === 'full';
  return <ParticleField count={count} network={network} />;
}
