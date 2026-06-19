export interface AnimationTokens {
  durations: Record<string, number>; // ms
  easings: Record<string, number[]>; // cubic-bezier control points
  stagger: Record<string, number>;
  scroll: { lerp: number; duration: number };
}
