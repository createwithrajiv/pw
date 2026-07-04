import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { useFxSignals } from '@/hooks/useFxSignals';

const FxCanvas = lazy(() => import('./FxCanvas'));

class FxErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Page-wide WebGL "liquid light" background. Only mounts on the `full` tier
 * (desktop, not reduced/lite) — otherwise the CSS StoryBackdrop carries the look.
 * Lazy, paused when the tab is hidden, error-boundary → nothing.
 */
export function FxBackground() {
  const fx = useFxSignals();
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (fx.tier !== 'full') return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 mix-blend-screen">
      <FxErrorBoundary>
        <Suspense fallback={null}>
          <FxCanvas active={pageVisible} fx={fx} dprMax={1.75} />
        </Suspense>
      </FxErrorBoundary>
    </div>
  );
}
