import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { CameraRig } from './rig/CameraRig';
import { LiquidLight } from './effects/LiquidLight';
import { World } from './world/World';
import { worldPalette } from './world/palette';
import { useExperienceStore } from '@/store/experienceStore';
import type { FxSignals } from '@/providers/FxProvider';

interface ExperienceProps {
  fx: FxSignals;
  /** Tab visible — pauses the frameloop when hidden. */
  active: boolean;
  /** Resolved theme — drives the world palette + blend mode. */
  theme: 'light' | 'dark';
}

/**
 * Scene root and the single persistent `<Canvas>`. This is the React.lazy target
 * (importing it is what pulls in the three-vendor chunk), so it only loads on the
 * `full` tier after hydration. The camera looks INTO the screen (−Z) and dives
 * forward through the tunnel as you scroll. The additive liquid-light backdrop
 * only renders in dark mode (it washes out a light page).
 */
export default function Experience({ fx, active, theme }: ExperienceProps) {
  const setQualityTier = useExperienceStore((s) => s.setQualityTier);
  const palette = worldPalette(theme);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 62 }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Adaptive quality: drop DPR under load, step the tier down on decline. */}
      <PerformanceMonitor
        onDecline={() => setQualityTier('lite')}
        onIncline={() => setQualityTier('full')}
      />
      <AdaptiveDpr pixelated />

      <CameraRig fx={fx} />
      {palette.liquid && <LiquidLight fx={fx} />}
      <World palette={palette} />
    </Canvas>
  );
}
