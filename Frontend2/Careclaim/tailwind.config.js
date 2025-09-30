/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-custom': '#000000',
        'yellow-custom': '#FFFF00',
        'yellow-icon-card': '#FFD700',
      },
    },
  },
  plugins: [],
}
