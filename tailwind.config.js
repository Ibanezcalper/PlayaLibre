/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgreen: {
          DEFAULT: '#1f2a1d',
          medium: '#2d3a2a',
          hover: '#2a3827',
          text: '#4b5b47',
          primary: '#336443',
          accent: '#85AB8B',
          bottomtext: '#3d5638',
          bottombg: '#3d5638',
          bottomhover: '#2d4228',
        }
      },
      fontFamily: {
        sans: ['"Neue Haas Grotesk Display Pro 55 Roman"', '"Neue Haas Grotesk Text Pro"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
