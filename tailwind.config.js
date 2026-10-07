/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#B9DDFF',
          300: '#7CB9FD',
          400: '#3894F9',
          500: '#1075E9',
          600: '#0357C7',
          700: '#0345A1',
          800: '#073B83',
          900: '#0C336D',
        }
      }
    },
  },
  plugins: [],
}
