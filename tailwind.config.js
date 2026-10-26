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
