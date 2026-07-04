import { HeroZone } from './zones/HeroZone';
import { FocalCore } from './FocalCore';
import { WorldScaffold } from './WorldScaffold';

/**
 * The 3D world content. Phase 1 slice: the hero constellation at origin, a focal
 * object, and the depth scaffold (grid horizon + forms at varied depths) the
 * camera weaves through. Phase 2 makes this registry-driven — one lazy zone per
 * section, keyed by the same `useSections()` list that drives the DOM.
 */
export function World() {
  return (
    <>
      <HeroZone />
      <FocalCore />
      <WorldScaffold />
    </>
  );
}
