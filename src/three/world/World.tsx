import { HeroZone } from './zones/HeroZone';
import { FocalCore } from './FocalCore';

/**
 * The 3D world content. Phase 1 slice: the hero constellation at origin + one
 * focal object the camera drifts past. Phase 2 makes this registry-driven — one
 * lazy zone per section, keyed by the same `useSections()` list that drives the
 * DOM, so adding a section's 3D moment is one zone file + one registry entry.
 */
export function World() {
  return (
    <>
      <HeroZone />
      <FocalCore />
    </>
  );
}
