/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#07090f', 2: '#0b0f17' },
        surface: { DEFAULT: '#11151f', 2: '#181d2a', 3: '#222a3a' },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.16)',
          accent: 'rgba(255,44,85,0.55)',
        },
        fg: {
          DEFAULT: '#ffffff',
          1: '#e8ecf3',
          2: '#a8b0c0',
          3: '#6b7385',
          disabled: '#444a59',
        },
        primary: {
          DEFAULT: '#ff2c55',
          hover: '#ff4d6f',
          press: '#e01441',
          soft: 'rgba(255,44,85,0.16)',
        },
        gold: { DEFAULT: '#ffc83a', soft: 'rgba(255,200,58,0.14)' },
        cyan: { DEFAULT: '#2ad4ff', soft: 'rgba(42,212,255,0.14)' },
        success: '#2ecc71',
        warning: '#ffb020',
        danger: '#ff4d4f',
        info: '#5b8def',
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
        glow: '0 0 32px rgba(255,44,85,0.35)',
        poster: '0 12px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.40)',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #ff2c55 0%, #ff6a3d 100%)',
        'grad-hero-bottom':
          'linear-gradient(180deg, rgba(7,9,15,0) 0%, rgba(7,9,15,0.4) 40%, rgba(7,9,15,0.85) 75%, #07090f 100%)',
        'grad-hero-left':
          'linear-gradient(90deg, #07090f 0%, rgba(7,9,15,0.85) 25%, rgba(7,9,15,0.30) 65%, rgba(7,9,15,0) 100%)',
      },
      transitionTimingFunction: { 'np-out': 'cubic-bezier(.22,.61,.36,1)' },
      transitionDuration: { fast: '120ms', base: '240ms', slow: '420ms' },
      maxWidth: { container: '1440px' },
    },
  },
  plugins: [],
};
