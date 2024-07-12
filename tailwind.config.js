/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: "#FFCC00",
        yellowCardText: "#48380B",
        whiteCardText: "#50452D",

        surface: "#171717",
        textHigh: "#FFCC00",
        textMedium: "#A48300",
        textLow: "#634F00",
        positive: "#0B8900",
        negative: "#740000",
        textNeutral: "#626262",
        borderMedium: "#2E2E2E",
      },
      fontSize: {
        xl: ["1.5rem", "2rem"],
        md: ["1rem", "1.25rem"],
        sm: ["0.75rem", "1rem"],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      /**
       * This function adds CSS variables for each color in the theme object.
       */
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
