
module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          850: '#1c1917',
          950: '#0c0a09',
        },
        art: {
          red: '#D93838',
          yellow: '#F2C029',
          blue: '#2B5BA6',
          wood: '#8C6A4B',
        }
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  safelist: [
    'bg-gradient-to-r',
    'from-green-600',
    'to-emerald-400',
    'from-yellow-600',
    'to-amber-400',
    'from-red-600',
    'to-orange-500',
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-3'
  ],
  plugins: [],
}
