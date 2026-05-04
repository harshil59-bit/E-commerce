/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        brand: "#146c94",
        accent: "#f59e0b",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 42, 0.10)",
      },
    },
  },
  plugins: [],
};
