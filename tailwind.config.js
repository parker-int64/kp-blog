/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    './docs/**/*.{vue,js,ts,md}',
    ".vitepress/theme/*.{js,ts,vue}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

