/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "sm-custom": { raw: "(max-width: 900px)" },
      },
    },
  },
  plugins: [],
};
