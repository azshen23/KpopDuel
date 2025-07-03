/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        dark: '#2C3E50',
        light: '#F8F9FA'
      }
    },
  },
  plugins: [require("nativewind/tailwind/css")],
}