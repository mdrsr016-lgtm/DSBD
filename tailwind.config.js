/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#06090F',
        'icy-white': '#F8FAFC',
        'premium-cyan': '#22D3EE',
        'neon-rose': '#FF4D6D'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
