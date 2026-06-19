/** Static gradient + glow backdrop used as the hero fallback (reduced motion,
 *  no WebGL, or while the canvas chunk loads). Paints instantly. */
export function HeroGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-grid-static opacity-[0.4]" />
      <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute right-[10%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-accent-2/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[15%] h-[40vh] w-[40vh] rounded-full bg-accent-3/10 blur-[120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas" />
    </div>
  );
}
