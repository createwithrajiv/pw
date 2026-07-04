import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import { useSections } from '@/hooks/useSections';
import { buildKeyframes, buildPositionCurve, sampleLookAt } from './cameraPath';
import type { FxSignals } from '@/providers/FxProvider';

/**
 * Drives the persistent camera along a scroll-linked path. Reads the shared
 * scroll progress (0→1) from the fx signal bus — prop-bridged across the R3F
 * boundary — and damps the camera toward the sampled pose each frame.
 *
 * Nav "fly-to" works for free: clicking a nav item calls Lenis `scrollTo`, which
 * animates the scroll → progress changes → the camera flies to that stop.
 */
export function CameraRig({ fx }: { fx: FxSignals }) {
  const camera = useThree((s) => s.camera);
  const sections = useSections();

  const { keyframes, curve } = useMemo(() => {
    const ids = sections.map((s) => s.id);
    const kf = buildKeyframes(ids);
    return { keyframes: kf, curve: buildPositionCurve(kf) };
  }, [sections]);

  const targetPos = useRef(new THREE.Vector3(0, 0.2, 7.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const u = THREE.MathUtils.clamp(fx.scrollProgress.get(), 0, 1);
    curve.getPointAt(u, targetPos.current);
    sampleLookAt(keyframes, u, targetLook.current);

    // Idle breathing drift so the space reads as 3D even at rest.
    const t = state.clock.elapsedTime;
    targetPos.current.x += Math.sin(t * 0.3) * 0.25;
    targetPos.current.y += Math.cos(t * 0.23) * 0.18;

    // Critically-damped follow (frame-rate independent) for both position and
    // the look-at target, then orient the camera.
    damp3(camera.position, targetPos.current, 0.4, delta);
    damp3(currentLook.current, targetLook.current, 0.4, delta);
    camera.lookAt(currentLook.current);
  });

  return null;
}
