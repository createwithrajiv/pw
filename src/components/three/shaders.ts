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

/** Page-wide "liquid light" background — fullscreen quad, reacts to scroll + cursor + velocity. */
export const fxBackgroundVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fxBackgroundFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uVelocity;

  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 warp = uMouse * 0.06 + vec2(0.0, uVelocity * 0.05);
    float n = fbm(uv * 2.2 + warp + uTime * 0.03);
    float n2 = fbm(uv * 4.5 - warp + uTime * 0.05);

    vec3 cyan = vec3(0.12, 0.85, 0.96);
    vec3 violet = vec3(0.55, 0.35, 0.95);
    vec3 magenta = vec3(0.96, 0.30, 0.62);
    vec3 base = mix(cyan, violet, smoothstep(0.0, 0.5, uScroll));
    base = mix(base, magenta, smoothstep(0.5, 1.0, uScroll));

    float surge = 0.10 + abs(uVelocity) * 0.18;
    float field = smoothstep(0.35, 0.85, n) * (0.5 + n2 * 0.5);
    float vig = smoothstep(1.15, 0.2, length(vUv - 0.5));
    float alpha = field * surge * vig;

    gl_FragColor = vec4(base, alpha);
  }
`;
