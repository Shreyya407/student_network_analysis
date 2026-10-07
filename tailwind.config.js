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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        dark: {
          bg: '#0B0F17',
          card: '#131B2A',
          border: '#1E293B',
          muted: '#94A3B8'
        }
      },
      boxShadow: {
        'glow-red': '0 0 20px -5px rgba(225, 29, 72, 0.35)',
        'glow-sm': '0 0 10px -2px rgba(225, 29, 72, 0.25)',
      }
    },
  },
  plugins: [],
}
