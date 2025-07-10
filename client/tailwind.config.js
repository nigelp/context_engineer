/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slate-dark': '#1E293B',
        'slate-light': '#F1F5F9',
        'accent-aqua': '#2DD4BF',
      }
    },
  },
  plugins: [],
}