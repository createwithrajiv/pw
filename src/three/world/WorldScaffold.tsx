import { useMemo, useRef, type ReactNode } from 'react';
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
      <torusGeometry args={[radius, 0.045, 8, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={palette.lineOpacity}
        blending={palette.blending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** A slow-rotating wireframe form drifting past in the periphery. */
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
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * spin;
    g.rotation.x += delta * spin * 0.4;
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        {children}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={palette.lineOpacity}
          blending={palette.blending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** A field of stars spread through the tunnel depth — streams past as you fly in. */
function Starfield({ palette }: { palette: WorldPalette }) {
  const positions = useMemo(() => {
    const N = 420;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 3 + Math.random() * 9;
      arr[i * 3] = Math.cos(ang) * rad;
      arr[i * 3 + 1] = Math.sin(ang) * rad;
      arr[i * 3 + 2] = 8 - Math.random() * 48; // spread along the flight path
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color={palette.a}
        transparent
        opacity={palette.lineOpacity * 0.9}
        blending={palette.blending}
        depthWrite={false}
      />
    </points>
  );
}

const GATES = [4, -2, -8, -14, -20, -26, -32, -38];

/**
 * The tunnel the camera dives through: a run of ring gates receding into −Z, a
 * few wireframe forms in the periphery, and a starfield spanning the depth. As
 * the camera flies forward the gates grow and pass — reading as "going inside".
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
          radius={2.8 + (i % 3) * 0.5}
          color={gateColors[i % 3]}
          palette={palette}
          spin={0.05 + (i % 2) * 0.05}
        />
      ))}

      <FloatingForm position={[3.4, 1.6, 0]} color={palette.a} palette={palette} spin={0.2}>
        <octahedronGeometry args={[0.9, 0]} />
      </FloatingForm>
      <FloatingForm position={[-3.6, -1.4, -6]} color={palette.b} palette={palette} spin={0.14}>
        <torusGeometry args={[0.85, 0.26, 12, 32]} />
      </FloatingForm>
      <FloatingForm position={[3.2, -1.8, -12]} color={palette.c} palette={palette} spin={0.18}>
        <icosahedronGeometry args={[1.1, 0]} />
      </FloatingForm>
      <FloatingForm position={[-3.0, 1.8, -18]} color={palette.a} palette={palette} spin={0.12}>
        <dodecahedronGeometry args={[1.0, 0]} />
      </FloatingForm>
      <FloatingForm position={[2.6, 1.2, -26]} color={palette.c} palette={palette} spin={0.16}>
        <torusKnotGeometry args={[0.7, 0.22, 64, 12]} />
      </FloatingForm>
    </group>
  );
}
