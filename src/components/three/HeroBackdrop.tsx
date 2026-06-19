import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useSettings } from '@/hooks/useContent';
import { useIsTouch } from '@/hooks/useMediaQuery';
import { HeroGradient } from './HeroGradient';
import { HeroAtmosphere } from '@/components/hero/HeroAtmosphere';

const HeroCanvas = lazy(() => import('./HeroCanvas'));

/** Falls back to the static gradient if WebGL initialisation throws. */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * Hero background: a static gradient that paints instantly, with the WebGL
 * particle field layered on top when 3D is enabled. The canvas frameloop pauses
 * when the hero scrolls offscreen or the tab is hidden.
 */
export function HeroBackdrop() {
  const reduced = useReducedMotion();
  const { features } = useSettings();
  const isTouch = useIsTouch();
  const enable3D = features.hero3D && !reduced;

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px' });
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const active = inView && pageVisible;
  const density = isTouch ? 1400 : 3200;

  return (
    <div ref={ref} className="absolute inset-0 -z-10">
      <HeroGradient />
      <HeroAtmosphere />
      {enable3D && (
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <div className="absolute inset-0">
              <HeroCanvas active={active} density={density} network={!isTouch} />
            </div>
          </Suspense>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
