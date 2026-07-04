import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { particleFragmentShader, particleVertexShader } from './shaders';
import { NeuralNetwork } from './NeuralNetwork';
import { darkPalette, type WorldPalette } from '@/three/world/palette';

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  /** Render the sparse node+edge "AI network" layer (desktop only). */
  network?: boolean;
  /** Theme-reactive colors + blend mode. */
  palette?: WorldPalette;
}

/** GPU particle constellation that drifts and reacts to the cursor. */
export function ParticleField({
  count = 3200,
  radius = 4.2,
  network = false,
  palette = darkPalette,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const revealRef = useRef(0);
  const { viewport } = useThree();

  const { positions, scales, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    // Cyan → indigo → violet ramp from the active theme palette.
    const COLOR_A = new THREE.Color(palette.a);
    const COLOR_B = new THREE.Color(palette.b);
    const COLOR_C = new THREE.Color(palette.c);

    for (let i = 0; i < count; i++) {
      // Distribute in a soft spherical shell for volumetric depth.
      const r = radius * (0.35 + Math.pow(Math.random(), 0.6) * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.5;
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scales[i] = 0.4 + Math.random() * 1.8;

      const mix = Math.random();
      if (mix < 0.5) tmp.copy(COLOR_A).lerp(COLOR_B, mix * 2);
      else tmp.copy(COLOR_B).lerp(COLOR_C, (mix - 0.5) * 2);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return { positions, scales, colors };
  }, [count, radius, palette.a, palette.b, palette.c]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 34 },
      uReveal: { value: 0 },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75) },
    }),
    [],
  );

  useFrame((state, delta) => {
    // Ramp the shared intro reveal 0→1 (the field "emerges").
    revealRef.current = Math.min(1, revealRef.current + delta * 0.7);
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.uTime.value += delta;
      mat.uniforms.uReveal.value = revealRef.current;
      // Smoothly chase the pointer (state.pointer is normalized -1..1).
      mat.uniforms.uMouse.value.lerp(state.pointer, 0.05);
    }
    if (groupRef.current) {
      const targetY = state.pointer.x * 0.35;
      const targetX = -state.pointer.y * 0.25;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.z += delta * 0.01;
    }
  });

  // Keep the field comfortably framed regardless of aspect.
  const scale = Math.min(1, viewport.width / 9);

  return (
    <group ref={groupRef} scale={scale}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
      {network && <NeuralNetwork revealRef={revealRef} palette={palette} />}
    </group>
  );
}
