import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { WorldPalette } from './palette';

/** A ring "gate" the camera flies through — the core "going deeper inside" cue. */
function Gate({
  z,
  radius,
  color,
  palette,
  spin,
}: {
  z: number;
  radius: number;
  color: string;
  palette: WorldPalette;
  spin: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * spin;
  });
  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.03, 8, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={palette.lineOpacity * 0.7}
        blending={palette.blending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** A single slow-rotating wireframe form drifting in the far periphery. */
function FloatingForm({
  position,
  color,
  palette,
  spin,
  children,
}: {
  position: [number, number, number];
  color: string;
  palette: WorldPalette;
  spin: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * spin;
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.25;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        {children}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={palette.lineOpacity * 0.6}
          blending={palette.blending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Sparse stars spanning the tunnel depth — stream past subtly as you fly in. */
function Starfield({ palette }: { palette: WorldPalette }) {
  const positions = useMemo(() => {
    const N = 180;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 5 + Math.random() * 8; // kept out toward the edges, away from text
      arr[i * 3] = Math.cos(ang) * rad;
      arr[i * 3 + 1] = Math.sin(ang) * rad;
      arr[i * 3 + 2] = 6 - Math.random() * 42;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color={palette.a}
        transparent
        opacity={palette.lineOpacity * 0.7}
        blending={palette.blending}
        depthWrite={false}
      />
    </points>
  );
}

// Ten ring gates receding into the depth — a longer tunnel to fly through.
const GATES = [2, -3, -8, -13, -18, -23, -28, -33, -38, -43];

/**
 * The tunnel the camera dives through — deliberately minimal: a handful of ring
 * gates receding into −Z, two peripheral forms, and a thin starfield. Kept sparse
 * and low-opacity so the content stays the priority and text is easy to read.
 */
export function WorldScaffold({ palette }: { palette: WorldPalette }) {
  const gateColors = [palette.a, palette.b, palette.c];
  return (
    <group>
      <Starfield palette={palette} />

      {GATES.map((z, i) => (
        <Gate
          key={z}
          z={z}
          radius={2.6 + (i % 2) * 0.4}
          color={gateColors[i % 3]}
          palette={palette}
          spin={0.04}
        />
      ))}

      <FloatingForm position={[4.4, 2.2, -4]} color={palette.a} palette={palette} spin={0.15}>
        <octahedronGeometry args={[0.8, 0]} />
      </FloatingForm>
      <FloatingForm position={[-4.6, -2.4, -16]} color={palette.c} palette={palette} spin={0.12}>
        <icosahedronGeometry args={[0.9, 0]} />
      </FloatingForm>
    </group>
  );
}
