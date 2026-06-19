import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';

const STORAGE_KEY = 'hero-intro-played';
const FINAL_STEP = 6;

/**
 * Stages the cinematic hero intro as a single source of truth so Framer, the
 * R3F canvas, and the count-up all read one `step`:
 *   0 stars emerge · 1 grid in · 2 portrait · 3 headline · 4 metrics · 5 CTA · 6 done
 *
 * Plays ONCE per browser session. On repeat visits or reduced motion it jumps
 * straight to the final step (instant final state, no flash).
 */
export function useIntroSequence() {
  const reduced = useReducedMotion();
  const alreadyPlayed =
    typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1';
  const skip = reduced || alreadyPlayed;

  const [step, setStep] = useState(skip ? FINAL_STEP : 0);

  useEffect(() => {
    if (skip) {
      setStep(FINAL_STEP);
      return;
    }
    // Deliberate, not flashy — ~3.5s total.
    const schedule: Array<[number, number]> = [
      [1, 350],
      [2, 900],
      [3, 1300],
      [4, 2300],
      [5, 2900],
      [6, 3500],
    ];
    const timers = schedule.map(([s, t]) => window.setTimeout(() => setStep(s), t));
    const done = window.setTimeout(() => sessionStorage.setItem(STORAGE_KEY, '1'), 3600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [skip]);

  return {
    step,
    /** intro already finished / skipped — consumers can render final state. */
    played: skip,
  };
}
