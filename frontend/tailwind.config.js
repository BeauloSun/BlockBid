/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        navbar: "1350px",
      },
    },
  },
  fontFamily: {
    shadows: ["Shadows Into Light", "serif"],
  },
  plugins: [require("@tailwindcss/forms")],
};
