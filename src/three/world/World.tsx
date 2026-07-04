import { HeroZone } from './zones/HeroZone';
import { WorldScaffold } from './WorldScaffold';
import type { WorldPalette } from './palette';

/**
 * The 3D world content. Phase 1 slice: the hero constellation at origin + the
 * tunnel scaffold the camera dives through. Phase 2 makes this registry-driven —
 * one lazy zone per section, keyed by the same `useSections()` list as the DOM.
 */
export function World({ palette }: { palette: WorldPalette }) {
  return (
    <>
      <HeroZone palette={palette} />
      <WorldScaffold palette={palette} />
    </>
  );
}
