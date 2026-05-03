/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e5ecff",
          500: "#3559e0",
          700: "#243ea1",
        },
      },
    },
  },
  plugins: [],
};
