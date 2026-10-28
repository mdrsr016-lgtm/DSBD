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
        'premium-cyan': '#0EA5E9',
        'teal-accent': '#0D9488',
        'slate-secondary': '#94A3B8',
        'slate-muted': '#64748B',
        'subtle-divider': '#1E293B',
        'status-green': '#10B981',
        'neon-rose': '#F43F5E',
        'flat-rose': '#F43F5E'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
