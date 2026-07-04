import { AdditiveBlending, NormalBlending, type Blending } from 'three';

/**
 * Theme-reactive look for the 3D world. Dark mode glows (bright colors, additive
 * blending, liquid-light backdrop on). Light mode reads as clean dark-on-light
 * (deep saturated colors, normal blending, no additive washout) so a bright page
 * looks intentional instead of a blown-out neon smear.
 */
export interface WorldPalette {
  a: string;
  b: string;
  c: string;
  pulse: string;
  grid: string;
  gridDim: string;
  blending: Blending;
  /** Whether the additive fullscreen "liquid light" backdrop should render. */
  liquid: boolean;
  /** Base opacity for line/scaffold materials. */
  lineOpacity: number;
}

export const darkPalette: WorldPalette = {
  a: '#22d3f0',
  b: '#6366f1',
  c: '#9a7bff',
  pulse: '#9fe9ff',
  grid: '#2a7fa8',
  gridDim: '#173247',
  blending: AdditiveBlending,
  liquid: true,
  lineOpacity: 0.55,
};

export const lightPalette: WorldPalette = {
  a: '#0e7490', // deep teal
  b: '#4338ca', // indigo
  c: '#7c3aed', // violet
  pulse: '#0891b2',
  grid: '#3b82a6',
  gridDim: '#9fb3c8',
  blending: NormalBlending,
  liquid: false,
  lineOpacity: 0.5,
};

export function worldPalette(theme: 'light' | 'dark'): WorldPalette {
  return theme === 'light' ? lightPalette : darkPalette;
}
