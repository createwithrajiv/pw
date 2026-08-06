import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

/**
 * Light-first, token-driven config. Every colour resolves to an HSL channel CSS
 * variable defined in src/themes/tokens.css so utilities can apply alpha via
 * `hsl(var(--token) / <alpha-value>)`.
 *
 * `borderRadius` and `boxShadow` sit OUTSIDE `extend` on purpose: `extend`
 * merges key-by-key into Tailwind's defaults, which is exactly why the old
 * config left stock `2xl` (16px) reachable and smaller than its own overridden
 * `xl` (28px). Replacing the scales makes the ceiling real.
 *
 * `keyframes`/`animation` must stay INSIDE `extend`, or core utilities like
 * `animate-ping` (the availability dot) disappear.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // 10-12px everywhere. xl/2xl/3xl are capped aliases so existing call sites
    // keep compiling but can never render larger than lg.
    borderRadius: {
      none: '0px',
      sm: '6px',
      DEFAULT: '8px',
      md: '10px',
      lg: '12px',
      xl: '12px',
      '2xl': '12px',
      '3xl': '12px',
      full: '9999px', // avatars, the profile portrait, and the status dot only
    },
    boxShadow: {
      none: 'none',
      sm: 'var(--shadow-sm)',
      DEFAULT: 'var(--shadow-md)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },
    extend: {
      colors: {
        base: 'hsl(var(--bg-base) / <alpha-value>)',
        canvas: 'hsl(var(--bg-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          hi: 'hsl(var(--surface-hi) / <alpha-value>)',
        },
        foreground: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--fg-muted) / <alpha-value>)',
        subtle: 'hsl(var(--fg-subtle) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          hover: 'hsl(var(--accent-hover) / <alpha-value>)',
          strong: 'hsl(var(--accent-strong) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-fg) / <alpha-value>)',
        },
        ring: 'hsl(var(--accent) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        scrim: 'hsl(var(--scrim) / <alpha-value>)',
        code: {
          keyword: 'hsl(var(--code-keyword) / <alpha-value>)',
          string: 'hsl(var(--code-string) / <alpha-value>)',
          number: 'hsl(var(--code-number) / <alpha-value>)',
          comment: 'hsl(var(--code-comment) / <alpha-value>)',
          function: 'hsl(var(--code-function) / <alpha-value>)',
          type: 'hsl(var(--code-type) / <alpha-value>)',
          tag: 'hsl(var(--code-tag) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        // One family for headings and body. `font-display` is kept as an alias
        // so its 40-odd call sites stay valid.
        display: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      // Weights are baked into the scale (headings 700, section/card titles
      // 600, body 400) so components stop hand-setting them. These land in the
      // utilities layer, so they win over the base layer's heading weight.
      fontSize: {
        display: [
          'clamp(2.25rem, 1.3rem + 3.4vw, 3.5rem)',
          { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '700' },
        ],
        h1: [
          'clamp(1.875rem, 1.4rem + 1.8vw, 2.5rem)',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        h2: [
          'clamp(1.5rem, 1.25rem + 1vw, 1.875rem)',
          { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' },
        ],
        h3: [
          'clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)',
          { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        lead: ['clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.65' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '500' }],
      },
      // Long-form article typography, mapped to the same tokens so one
      // definition covers both themes.
      typography: {
        blog: {
          css: {
            maxWidth: 'none',
            fontSize: '1.0625rem',
            lineHeight: '1.75',
            '--tw-prose-body': 'hsl(var(--fg-muted))',
            '--tw-prose-headings': 'hsl(var(--fg))',
            '--tw-prose-lead': 'hsl(var(--fg-muted))',
            '--tw-prose-links': 'hsl(var(--accent))',
            '--tw-prose-bold': 'hsl(var(--fg))',
            '--tw-prose-counters': 'hsl(var(--fg-muted))',
            '--tw-prose-bullets': 'hsl(var(--border-strong))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--fg))',
            '--tw-prose-quote-borders': 'hsl(var(--accent))',
            '--tw-prose-captions': 'hsl(var(--fg-muted))',
            '--tw-prose-code': 'hsl(var(--fg))',
            '--tw-prose-pre-code': 'hsl(var(--fg))',
            '--tw-prose-pre-bg': 'transparent',
            '--tw-prose-th-borders': 'hsl(var(--border-strong))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            'h1, h2, h3, h4': { fontWeight: '600', letterSpacing: '-0.015em' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            a: { fontWeight: '500', textUnderlineOffset: '3px' },
          },
        },
      },
      maxWidth: {
        // 1200px everywhere per the design doc. `container-wide` is an alias so
        // the chrome that used 1320px lands on the same measure.
        container: '1200px',
        'container-wide': '1200px',
      },
      spacing: {
        section: 'clamp(4rem, 2.5rem + 4vw, 7rem)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // Only the marquee survives — it is a documented, deliberate exception to
      // the 150-300ms rule. `animate-ping` (the status dot) is a core utility
      // and is preserved by keeping this block inside `extend`.
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 36s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 36s) linear infinite',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
