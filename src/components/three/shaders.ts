/** GLSL for the hero "neural constellation" particle field (inlined as strings). */

export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uReveal;

  attribute float aScale;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec3 pos = position;

    // Slow idle drift so the field feels alive (all on the GPU).
    float t = uTime * 0.18;
    pos.x += sin(t + position.z * 0.6) * 0.18;
    pos.y += cos(t + position.x * 0.6) * 0.18;
    pos.z += sin(t + position.y * 0.6) * 0.18;

    // Cursor repulsion in the XY plane.
    vec2 m = uMouse * 3.2;
    float d = distance(pos.xy, m);
    float repulse = smoothstep(1.8, 0.0, d) * 0.5;
    pos.xy += normalize(pos.xy - m + 0.0001) * repulse;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(0.1, -mvPosition.z)) * (0.4 + 0.6 * uReveal);

    vColor = aColor;
    vDepth = -mvPosition.z;
  }
`;

export const particleFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uReveal;

  varying vec3 vColor;
  varying float vDepth;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    // Fade distant points for depth.
    alpha *= clamp(1.25 - vDepth * 0.05, 0.12, 1.0);
    alpha *= uReveal;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/** Edge lines for the sparse "AI network" — a bright data pulse travels each edge. */
export const networkLineVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uSpeed;

  attribute float aLineProgress; // 0 at start vertex, 1 at end
  attribute float aEdgeId;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vPulse;
  varying float vReveal;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Travelling data pulse: a moving bright head along each edge (wraps).
    float head = fract(uTime * uSpeed + aEdgeId * 6.2831);
    float d = abs(aLineProgress - head);
    d = min(d, 1.0 - d);
    vPulse = smoothstep(0.14, 0.0, d);

    vColor = aColor;
    vReveal = uReveal;
  }
`;

export const networkLineFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uPulseColor;

  varying vec3 vColor;
  varying float vPulse;
  varying float vReveal;

  void main() {
    vec3 color = mix(vColor, uPulseColor, vPulse);
    float alpha = (0.08 + vPulse * 0.85) * vReveal;
    gl_FragColor = vec4(color, alpha);
  }
`;
