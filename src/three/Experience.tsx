import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { CameraRig } from './rig/CameraRig';
import { LiquidLight } from './effects/LiquidLight';
import { World } from './world/World';
import { useExperienceStore } from '@/store/experienceStore';
import type { FxSignals } from '@/providers/FxProvider';

interface ExperienceProps {
  fx: FxSignals;
  /** Tab visible — pauses the frameloop when hidden. */
  active: boolean;
}

/**
 * Scene root and the single persistent `<Canvas>`. This is the React.lazy target
 * (importing it is what pulls in the three-vendor chunk), so it only loads on the
 * `full` tier after hydration. Continuous fx signals are prop-bridged in; discrete
 * state (quality tier) lives in the Zustand store, readable inside the canvas.
 */
export default function Experience({ fx, active }: ExperienceProps) {
  const setQualityTier = useExperienceStore((s) => s.setQualityTier);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Adaptive quality: drop DPR under load, step the tier down on decline. */}
      <PerformanceMonitor
        onDecline={() => setQualityTier('lite')}
        onIncline={() => setQualityTier('full')}
      />
      <AdaptiveDpr pixelated />

      <CameraRig fx={fx} />
      <LiquidLight fx={fx} />
      <World />
    </Canvas>
  );
}
