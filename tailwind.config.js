// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind / NativeWind to use class-based dark mode,
  // which matches what the runtime wants.
  darkMode: "class",

  // NativeWind preset
  presets: [require("nativewind/preset")],

  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
