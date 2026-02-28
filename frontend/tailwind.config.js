/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F7D6E0",
          hover: "#16A34A",
        },
        bg: {
          DEFAULT: "#0F172A",
          soft: "#020617",
        },
        surface: "#020617",
        border: "#1E293B",
        text: {
          heading: "#F8FAFC",
          body: "#CBD5E1",
          muted: "#94A3B8",
        },
        danger: "#EF4444",
        warning: "#F59E0B",
        info: "#38BDF8",
      },
    },
  },
  plugins: [],
};
