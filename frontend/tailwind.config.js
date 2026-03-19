/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: '#0A0E1A',
          surface: '#111827',
          border: '#1F2937',
          accent: '#00F0FF',
          critical: '#EF4444',
          elevated: '#FBBF24',
          moderate: '#22C55E',
          purple: '#A78BFA',
          pink: '#F472B6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
