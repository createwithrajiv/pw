import * as THREE from 'three';

export interface CameraKeyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

/** The camera's start pose — framing the constellation, looking INTO the screen. */
const HERO: CameraKeyframe = {
  position: new THREE.Vector3(0, 0, 8),
  lookAt: new THREE.Vector3(0, 0, -6),
};

const overrides: Record<string, CameraKeyframe> = { hero: HERO };

/**
 * The journey flies FORWARD into the screen (z: 8 → −38) with only a gentle
 * lateral/vertical weave — never a big descent. Scrolling reads as "going deeper
 * inside", diving through the tunnel of gates, not panning down a page.
 */
function defaultKeyframe(i: number, n: number): CameraKeyframe {
  const t = n > 1 ? i / (n - 1) : 0;
  const x = Math.sin(t * Math.PI * 3.0) * 1.4;
  const y = Math.sin(t * Math.PI * 2.0) * 0.8;
  const z = 8 - t * 46;
  return {
    position: new THREE.Vector3(x, y, z),
    lookAt: new THREE.Vector3(x * 0.4, y * 0.4, z - 10),
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
  if (pts.length < 2) pts.push((pts[0] ?? new THREE.Vector3()).clone().add(new THREE.Vector3(0, 0, -1)));
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
