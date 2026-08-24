/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--np-bg-rgb) / <alpha-value>)',
          2: 'rgb(var(--np-bg-2-rgb) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--np-surface-rgb) / <alpha-value>)',
          2: 'rgb(var(--np-surface-2-rgb) / <alpha-value>)',
          3: 'rgb(var(--np-surface-3-rgb) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'var(--np-border)',
          strong: 'var(--np-border-strong)',
          accent: 'var(--np-border-accent)',
        },
        fg: {
          DEFAULT: 'var(--np-fg)',
          1: 'var(--np-fg-1)',
          2: 'var(--np-fg-2)',
          3: 'var(--np-fg-3)',
          disabled: 'var(--np-fg-disabled)',
        },
        primary: {
          DEFAULT: 'rgb(var(--np-primary-rgb) / <alpha-value>)',
          hover: 'var(--np-primary-hover)',
          press: 'var(--np-primary-press)',
          soft: 'var(--np-primary-soft)',
        },
        gold: {
          DEFAULT: 'rgb(var(--np-gold-rgb) / <alpha-value>)',
          soft: 'var(--np-gold-soft)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--np-cyan-rgb) / <alpha-value>)',
          soft: 'var(--np-cyan-soft)',
        },
        success: 'rgb(var(--np-success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--np-warning-rgb) / <alpha-value>)',
        danger: 'rgb(var(--np-danger-rgb) / <alpha-value>)',
        info: 'rgb(var(--np-info-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Manrope', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '44px',
        '5xl': '60px',
        '6xl': '80px',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.40)',
        md: '0 8px 20px rgba(0,0,0,0.45)',
        lg: '0 24px 48px rgba(0,0,0,0.55)',
        glow: '0 0 32px rgb(var(--np-primary-rgb) / 0.35)',
        poster: '0 12px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.40)',
      },
      backgroundImage: {
        'grad-brand': 'var(--np-grad-brand)',
        'grad-hero-bottom': 'var(--np-grad-hero-bottom)',
        'grad-hero-left': 'var(--np-grad-hero-left)',
        'grad-gold': 'var(--np-grad-gold)',
      },
      transitionTimingFunction: { 'np-out': 'cubic-bezier(.22,.61,.36,1)' },
      transitionDuration: { fast: '120ms', base: '240ms', slow: '420ms' },
      maxWidth: { container: 'var(--np-container)' },
    },
  },
  plugins: [],
};
