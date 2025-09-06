/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8', // A nice blue
        secondary: '#16a34a', // A calm green
        background: '#f8fafc', // A light gray background
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
      },
    },
  },
  plugins: [],
}