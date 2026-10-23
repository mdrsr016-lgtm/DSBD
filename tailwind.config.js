/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#000000',
        'icy-white': '#F8FAFC',
        'premium-cyan': '#22D3EE',
        'teal-accent': '#14B8A6',
        'slate-secondary': '#94A3B8',
        'slate-muted': '#64748B',
        'subtle-divider': '#263746',
        'status-green': '#10B981',
        'neon-rose': '#FF4D6D'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
