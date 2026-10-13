/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          dark: '#0a0f1d',
          darkCard: '#111827',
          darkCardAlt: '#162032',
          darkBorder: '#1e293b',
          darkHover: '#1e293b',
          light: '#f8fafc',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
        }
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgb(0 0 0 / 0.03)',
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-sm': '0 0 12px -2px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
