/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // ...
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        scaleUp: "scaleUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        overflow: {
          "x-hidden": "hidden", // you can name this class as you prefer
        },
      },
    },
  },
  variants: {
    extend: {
      // ...
      animation: ["responsive", "motion-safe", "motion-reduce"],
      overflow: ["responsive"],
    },
    // if you want this utility to respect responsive breakpoints
  },
  plugins: [],
};
