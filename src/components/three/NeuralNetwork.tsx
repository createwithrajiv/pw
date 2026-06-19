import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { networkLineFragmentShader, networkLineVertexShader } from './shaders';

const NODE_COUNT = 28;
const K = 2; // nearest neighbours per node
const MAX_EDGES = 48;
const RADIUS = 4.2;

const COLOR_A = new THREE.Color('#1fd8f5'); // cyan
const COLOR_C = new THREE.Color('#8b5cf6'); // violet
const PULSE = new THREE.Color('#9fe9ff');

interface NeuralNetworkProps {
  /** Shared intro reveal (0→1) so the network fades in with the cloud. */
  revealRef: MutableRefObject<number>;
}

/**
 * A sparse node + edge lattice rendered inside the rotating particle group.
 * Nodes and lines are rigid (no per-vertex drift) so endpoints stay attached;
 * the parent group's rotation/tilt animates the whole network. A bright data
 * pulse travels each edge in the shader (GPU-only, no per-frame CPU work).
 */
export function NeuralNetwork({ revealRef }: NeuralNetworkProps) {
  const lineMat = useRef<THREE.ShaderMaterial>(null);

  const { nodePositions, lineGeometry } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = RADIUS * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta) * 1.5,
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }

    // K nearest-neighbour edges, deduped, capped.
    const seen = new Set<string>();
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < NODE_COUNT && edges.length < MAX_EDGES; i++) {
      const neighbours = nodes
        .map((n, j) => ({ j, d: n.distanceTo(nodes[i]) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d);
      for (let k = 0; k < K; k++) {
        const j = neighbours[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([i, j]);
        if (edges.length >= MAX_EDGES) break;
      }
    }

    const count = edges.length;
    const positions = new Float32Array(count * 2 * 3);
    const progress = new Float32Array(count * 2);
    const edgeId = new Float32Array(count * 2);
    const colors = new Float32Array(count * 2 * 3);

    edges.forEach(([a, b], e) => {
      const va = nodes[a];
      const vb = nodes[b];
      positions.set([va.x, va.y, va.z], e * 6);
      positions.set([vb.x, vb.y, vb.z], e * 6 + 3);
      progress[e * 2] = 0;
      progress[e * 2 + 1] = 1;
      const id = count > 1 ? e / count : 0;
      edgeId[e * 2] = id;
      edgeId[e * 2 + 1] = id;
      const ca = COLOR_A.clone().lerp(COLOR_C, (va.z / RADIUS + 1) / 2);
      const cb = COLOR_A.clone().lerp(COLOR_C, (vb.z / RADIUS + 1) / 2);
      colors.set([ca.r, ca.g, ca.b], e * 6);
      colors.set([cb.r, cb.g, cb.b], e * 6 + 3);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.setAttribute('aLineProgress', new THREE.BufferAttribute(progress, 1));
    lineGeometry.setAttribute('aEdgeId', new THREE.BufferAttribute(edgeId, 1));
    lineGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const nodePositions = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((n, i) => nodePositions.set([n.x, n.y, n.z], i * 3));

    return { nodePositions, lineGeometry };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSpeed: { value: 0.12 },
      uPulseColor: { value: PULSE },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (lineMat.current) {
      lineMat.current.uniforms.uTime.value += delta;
      lineMat.current.uniforms.uReveal.value = revealRef.current;
    }
  });

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <shaderMaterial
          ref={lineMat}
          vertexShader={networkLineVertexShader}
          fragmentShader={networkLineFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#9fe9ff"
          opacity={0.9}
        />
      </points>
    </group>
  );
}
