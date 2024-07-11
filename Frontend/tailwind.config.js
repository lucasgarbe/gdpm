/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /(bg|border)-(blue|amber|green)-(200|600)/ },
    { pattern: /(top|bottom)-20/ },
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.4rem",
      },
      fontFamily: {
        sans: ["var(--font-clash)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        hard: "2px 2px 0 black",
        harder: "4px 4px 0 black",
      },
    },
  },
  plugins: [],
};
