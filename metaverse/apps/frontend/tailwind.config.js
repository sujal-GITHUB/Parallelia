/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        greatvibes: ['"Great Vibes"', 'cursive'],
        pressstart: ['"Press Start 2P"', 'cursive'],
      },
      backgroundImage: {
        'custom-bcg': "url('/bcg.png')", 
      },
    },
  },
  plugins: [],
}