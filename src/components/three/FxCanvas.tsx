import { Canvas } from '@react-three/fiber';
import { FxPlane } from './FxPlane';
import type { FxSignals } from '@/providers/FxProvider';

interface FxCanvasProps {
  active: boolean;
  fx: FxSignals;
  dprMax: number;
}

/** Lazy-loaded page-wide fx canvas (default export = React.lazy target). */
export default function FxCanvas({ active, fx, dprMax }: FxCanvasProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, dprMax]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <FxPlane fx={fx} />
    </Canvas>
  );
}
