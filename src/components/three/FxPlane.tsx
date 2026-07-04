import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fxBackgroundFragmentShader, fxBackgroundVertexShader } from './shaders';
import type { FxSignals } from '@/providers/FxProvider';

/** Fullscreen quad shader plane. Reads the shared fx signals (passed as a prop —
 *  R3F's canvas is a separate React tree, so context can't cross the boundary). */
export function FxPlane({ fx }: { fx: FxSignals }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uScroll.value = fx.scrollProgress.get();
    m.uniforms.uVelocity.value = fx.velocity.get();
    m.uniforms.uMouse.value.set(fx.mouse.x.get(), fx.mouse.y.get());
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={fxBackgroundVertexShader}
        fragmentShader={fxBackgroundFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
