/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        nbe: {
          green: "#006341",
          grey: "#5a5a5a",
          light: "#f5f5f5",
          orange: "#F4A120",
        },
      },
    },
  },
  plugins: [],
}