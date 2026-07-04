import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** A slow-rotating wireframe object placed at a given depth along the journey. */
function FloatingForm({
  position,
  color,
  spin = 0.15,
  children,
}: {
  position: [number, number, number];
  color: string;
  spin?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * spin;
    g.rotation.x += delta * spin * 0.4;
    // gentle bob so the forms feel alive as you pass them
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.25;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        {children}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * The 3D scaffolding that sells the journey: a receding grid "floor" that gives a
 * horizon + several wireframe forms at different depths (z: 5 → −6) so the camera
 * visibly weaves past them as you scroll. Additive + unlit → cheap, no lights.
 */
export function WorldScaffold() {
  return (
    <group>
      {/* Receding grid floor — the horizon cue. */}
      <gridHelper
        args={[80, 60, '#2a7fa8', '#173247']}
        position={[0, -6.5, -6]}
        rotation={[0, 0, 0]}
      />
      <gridHelper
        args={[80, 60, '#3a2a8a', '#231a47']}
        position={[0, -14, -6]}
      />

      <FloatingForm position={[3.4, -2.4, 4]} color="#1fd8f5" spin={0.2}>
        <octahedronGeometry args={[0.9, 0]} />
      </FloatingForm>
      <FloatingForm position={[-3.9, -4.6, 1]} color="#6366f1" spin={0.12}>
        <torusGeometry args={[0.9, 0.28, 12, 32]} />
      </FloatingForm>
      <FloatingForm position={[2.7, -7.2, -2]} color="#8b5cf6" spin={0.18}>
        <icosahedronGeometry args={[1.1, 0]} />
      </FloatingForm>
      <FloatingForm position={[-2.4, -9.6, -4]} color="#1fd8f5" spin={0.1}>
        <dodecahedronGeometry args={[1.0, 0]} />
      </FloatingForm>
      <FloatingForm position={[3.1, -12, -3]} color="#8b5cf6" spin={0.14}>
        <torusKnotGeometry args={[0.7, 0.22, 64, 12]} />
      </FloatingForm>
    </group>
  );
}
