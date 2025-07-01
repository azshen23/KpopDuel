/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4B91',
        secondary: '#FF87B2',
        accent: '#FFE5E5',
        background: '#FFF0F0'
      }
    }
  },
  plugins: []
}