import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Dark-first, token-driven config. Every color resolves to an HSL channel CSS
 * variable defined in src/themes/tokens.css so utilities can apply alpha via
 * `hsl(var(--token) / <alpha-value>)`. Light + dark are both authored there.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // background layers
        base: 'hsl(var(--bg-base) / <alpha-value>)',
        canvas: 'hsl(var(--bg-canvas) / <alpha-value>)',
        elevated: 'hsl(var(--bg-elevated) / <alpha-value>)',
        overlay: 'hsl(var(--bg-overlay) / <alpha-value>)',
        // surfaces / glass
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          hi: 'hsl(var(--surface-hi) / <alpha-value>)',
        },
        glass: 'hsl(var(--glass-bg) / <alpha-value>)',
        // foreground
        foreground: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--fg-muted) / <alpha-value>)',
        subtle: 'hsl(var(--fg-subtle) / <alpha-value>)',
        // borders
        border: 'hsl(var(--border) / <alpha-value>)',
        'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
        // accents
        primary: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-fg) / <alpha-value>)',
        },
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-2': 'hsl(var(--accent-2) / <alpha-value>)',
        'accent-3': 'hsl(var(--accent-3) / <alpha-value>)',
        neon: 'hsl(var(--accent-2) / <alpha-value>)',
        'grid-line': 'hsl(var(--grid-line) / <alpha-value>)',
        ring: 'hsl(var(--accent) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 1.6rem + 5.6vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        h1: ['clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.75rem, 1.3rem + 2vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h3: ['clamp(1.25rem, 1.05rem + 0.9vw, 1.625rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.125rem, 1rem + 0.5vw, 1.375rem)', { lineHeight: '1.5' }],
        body: ['clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)', { lineHeight: '1.65' }],
        eyebrow: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '28px',
        pill: '999px',
      },
      maxWidth: {
        container: '1200px',
        'container-wide': '1320px',
      },
      spacing: {
        section: 'clamp(5rem, 3rem + 8vw, 9rem)',
      },
      boxShadow: {
        sm: '0 1px 2px hsl(var(--bg-base) / 0.6)',
        md: '0 8px 24px -8px hsl(var(--bg-base) / 0.7)',
        lg: '0 24px 60px -20px hsl(var(--bg-base) / 0.8)',
        glow: '0 0 0 1px hsl(var(--accent) / 0.25), 0 4px 30px -6px hsl(var(--glow-cyan) / 0.4)',
        'glow-lg': '0 0 40px -6px hsl(var(--glow-cyan) / 0.45), 0 0 80px -24px hsl(var(--glow-violet) / 0.4)',
      },
      backgroundImage: {
        'grad-accent':
          'linear-gradient(135deg, hsl(var(--grad-from)), hsl(var(--grad-mid)) 50%, hsl(var(--grad-to)))',
        'grad-text': 'linear-gradient(120deg, hsl(var(--grad-from)), hsl(var(--grad-to)))',
        'grad-radial':
          'radial-gradient(60% 50% at 50% 0%, hsl(var(--glow-violet) / 0.18), transparent 70%)',
      },
      keyframes: {
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '56px 56px' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'scroll-cue': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '40%': { opacity: '1' },
          '80%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        'conic-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'beam-sweep': {
          '0%': { transform: 'translateX(-60%) rotate(12deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(160%) rotate(12deg)', opacity: '0' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'grid-pan': 'grid-pan 14s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        marquee: 'marquee var(--marquee-duration, 36s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 36s) linear infinite',
        float: 'float 5s ease-in-out infinite',
        'scroll-cue': 'scroll-cue 1.8s ease-in-out infinite',
        'conic-spin': 'conic-spin 18s linear infinite',
        'beam-sweep': 'beam-sweep 12s ease-in-out infinite',
        orbit: 'orbit 26s linear infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
