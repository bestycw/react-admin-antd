/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '5.5': '1.375rem',
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
      },
    },
  },
  plugins: [],
} 