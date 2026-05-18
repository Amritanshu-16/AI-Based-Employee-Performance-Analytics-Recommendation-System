/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkNavy: '#0f172a',
        purpleBlue: '#4f46e5',
        cardBg: 'rgba(30, 41, 59, 0.7)',
      },
    },
  },
  plugins: [],
}
