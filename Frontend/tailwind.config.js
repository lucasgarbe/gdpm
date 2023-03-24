/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [{ pattern: /(bg|border)-(blue|amber|green)-(200|600)/ }],
  theme: {
    extend: {},
  },
  plugins: [],
};
