import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { useFxSignals } from '@/hooks/useFxSignals';
import { useHydrated } from '@/hooks/useHydrated';

const Experience = lazy(() => import('./Experience'));

/** WebGL init failure → nothing; the CSS fallbacks (HeroGradient / StoryBackdrop) carry the look. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single persistent 3D world, mounted once behind all DOM content
 * (fixed, -z-10, pointer-events:none). Only mounts on the `full` tier (desktop,
 * motion on) and after hydration — so it never renders server-side and
 * low-power / reduced-motion / no-WebGL users fall back to the CSS layers.
 * Paused (frameloop 'never') when the tab is hidden. Replaces the old
 * FxBackground + the hero's separate canvas with one shared scene.
 */
export function CanvasRoot() {
  const fx = useFxSignals();
  const hydrated = useHydrated();
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!hydrated || fx.tier !== 'full') return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 mix-blend-screen">
      <SceneErrorBoundary>
        <Suspense fallback={null}>
          <Experience fx={fx} active={pageVisible} />
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}
