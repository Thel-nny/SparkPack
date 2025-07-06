const plugin = require('tailwindcss/plugin');
const twAnimate = require('tw-animate-css');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    twAnimate,
  ],
};
