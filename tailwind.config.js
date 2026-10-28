const { colors } = require("./src/themes/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...colors,
      },

      fontSize: {
        13: ["0.8125rem", { lineHeight: "1.125rem" }],
        "13px": ["0.8125rem", { lineHeight: "1.125rem" }],
        xsm: ["0.8125rem", { lineHeight: "1.125rem" }],
      },

      fontFamily: {
        sans: ["DMSans_400Regular"],
        "dm-regular": ["DMSans_400Regular"],
        "dm-medium": ["DMSans_500Medium"],
        "dm-semibold": ["DMSans_600SemiBold"],
        "dm-bold": ["DMSans_700Bold"],
      },
    },
  },
  plugins: [],
};
