/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        dark: {
          // Naming is hard
          very: "#060606",
          kinda: "#131315",
          almost: "#222326",
          soft: "#8a8f98",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        tiny: "rgb(38 38 44 / 10%) 0px 2px 4px",
        in: "rgb(237 237 238) 0px 0px 0px 1px inset",
      },
      height: {
        7.5: "30px",
        11.5: "46px",
      },
    },
  },
  plugins: [],
};
