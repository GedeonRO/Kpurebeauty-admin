/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14A800',
        secondary: '#034C53',
      },
      fontFamily: {
        sans: ['SpaceGrotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
