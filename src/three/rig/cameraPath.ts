import * as THREE from 'three';

export interface CameraKeyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

/**
 * Bespoke camera keyframes by section id. Any section without an entry gets a
 * generated keyframe from `defaultKeyframe`, so the camera always has a coherent
 * stop. Phase 2 will register the rest as their 3D zones are authored.
 */
const overrides: Record<string, CameraKeyframe> = {
  hero: {
    position: new THREE.Vector3(0, 0, 6),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
};

/** A gentle drifting descent — the default "flying through space" stop. */
function defaultKeyframe(i: number, n: number): CameraKeyframe {
  const t = n > 1 ? i / (n - 1) : 0;
  const sway = Math.sin(t * Math.PI * 1.5);
  const x = sway * 2.4;
  const y = -t * 7;
  const z = 6 + Math.sin(t * Math.PI) * -1.2; // dips a little closer mid-journey
  return {
    position: new THREE.Vector3(x, y, z),
    lookAt: new THREE.Vector3(x * 0.35, y - 0.6, z - 6),
  };
}

/** Ordered keyframes for the given section ids (bespoke override or default). */
export function buildKeyframes(sectionIds: string[]): CameraKeyframe[] {
  const n = sectionIds.length;
  return sectionIds.map((id, i) => overrides[id] ?? defaultKeyframe(i, n));
}

/** Smooth Catmull-Rom curve through the keyframe positions for camera travel. */
export function buildPositionCurve(keyframes: CameraKeyframe[]): THREE.CatmullRomCurve3 {
  const pts = keyframes.map((k) => k.position.clone());
  // Catmull-Rom needs >= 2 points; guard the degenerate single-section case.
  if (pts.length < 2) pts.push((pts[0] ?? new THREE.Vector3()).clone().add(new THREE.Vector3(0, -1, 0)));
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
}

/** Linearly interpolate the look-at target across keyframes at normalized u. */
export function sampleLookAt(
  keyframes: CameraKeyframe[],
  u: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const n = keyframes.length;
  if (n === 0) return out.set(0, 0, -1);
  if (n === 1) return out.copy(keyframes[0].lookAt);
  const scaled = THREE.MathUtils.clamp(u, 0, 1) * (n - 1);
  const i = Math.min(Math.floor(scaled), n - 2);
  const f = scaled - i;
  return out.copy(keyframes[i].lookAt).lerp(keyframes[i + 1].lookAt, f);
}
