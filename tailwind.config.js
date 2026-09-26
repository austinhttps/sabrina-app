/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff1f5',
          100: '#ffe4ed',
          200: '#ffccd9',
          300: '#ff9ebb',
          400: '#ff6294',
          500: '#f82b71',
          600: '#e51357',
          700: '#c10842',
          800: '#a10a3a',
          900: '#860d34',
        },
        espresso: {
          50: '#fbf8f5',
          100: '#f4ede6',
          200: '#e7d8cb',
          300: '#d5bcaa',
          400: '#be9982',
          500: '#a67c64',
          600: '#8b614d',
          700: '#6f4c3d',
          800: '#462e24',
          900: '#2b1a13',
          950: '#170c07',
        },
        skycream: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        butter: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Courier Prime"', '"Fira Code"', 'monospace'],
        display: ['"Cabinet Grotesk"', '"Playfair Display"', 'sans-serif'],
        cursive: ['"Great Vibes"', '"Dancing Script"', 'cursive', 'sans-serif'],
        handwritten: ['"Dancing Script"', '"Caveat"', 'cursive', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin-reverse 12s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'tape-play': 'spin 3.5s linear infinite',
        'tape-fast': 'spin 1s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'glossy': '0 8px 32px 0 rgba(255, 98, 148, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        'diner': '4px 4px 0px 0px rgba(43, 26, 19, 0.9)',
        'diner-lg': '6px 6px 0px 0px rgba(43, 26, 19, 0.9)',
        'diner-pink': '5px 5px 0px 0px #e11d48',
        'cassette': '0 20px 40px -15px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
        'polaroid': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glow-pink': '0 0 25px rgba(244, 63, 94, 0.45)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.45)',
      }
    },
  },
  plugins: [],
}
