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
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          200: '#d9d6fe',
          300: '#beb7fd',
          400: '#9d8ffa',
          500: '#7c61f7',
          600: '#6d5ef9', // Primary Purple
          700: '#5b47e4',
          800: '#4b39c0',
          900: '#3f319c',
          950: '#261c6b',
        },
        indigo: {
          600: '#4f46e5', // Secondary Indigo
        },
        emerald: {
          500: '#22c55e', // Success Green
        },
        amber: {
          500: '#f59e0b', // Warning Orange
        },
        red: {
          500: '#ef4444', // Danger Red
        }
      },
      boxShadow: {
        'soft-xs': '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'soft-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'soft-md': '0 6px 16px 0 rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.08)',
        'purple-glow': '0 10px 30px -5px rgba(109, 94, 249, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
