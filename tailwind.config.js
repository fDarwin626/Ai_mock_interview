/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout.{js,ts,jsx,tsx}",            // your root layout.tsx
    "./components/**/*.{js,ts,jsx,tsx}",   // all components
    "./lib/**/*.{js,ts,jsx,tsx}",          // lib/actions, utils, etc.
    "./firebase/**/*.{js,ts,jsx,tsx}",     // firebase setup files
    "./constants/**/*.{js,ts,jsx,tsx}",    // constants folder
    "./types/**/*.{js,ts,jsx,tsx}",        // type definitions if any UI usage
    "./public/**/*.{html,js}",             // optional: static content
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
