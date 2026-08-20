/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Minimalist Premium Light Palette (Strictly 2-3 colors)
        // 1. Off-White Canvas & Pure White Surfaces (#FAF9F6 & #FFFFFF)
        // 2. Deep Slate Graphite for Typography & Primary Elements (#0F172A)
        // 3. Emerald Green for Achievement & Focus Accents (#10B981)
        alabaster: '#FAF9F6',
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50:  '#F8FAFC',
        },
        emerald: {
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
          100: '#D1FAE5',
          50:  '#ECFDF5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
