import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';

interface HeroCanvasProps {
  active: boolean;
  density: number;
  network: boolean;
}

/** Lazy-loaded WebGL canvas (default export = the React.lazy target). */
export default function HeroCanvas({ active, density, network }: HeroCanvasProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ pointerEvents: 'none' }}
    >
      <ParticleField count={density} network={network} />
    </Canvas>
  );
}
