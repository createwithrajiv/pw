import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A slow-rotating wireframe "core" positioned lower in the world, so the camera
 * drifts past it as you scroll away from the hero — a parallax depth cue that
 * you're travelling through a 3D space. Additive + unlit → ~2 draw calls, no
 * lights needed.
 */
export function FocalCore() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * 0.15;
    g.rotation.x += delta * 0.05;
  });

  return (
    <group ref={ref} position={[2.2, -4.4, -2.5]}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#1fd8f5"
          wireframe
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={0.5}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
