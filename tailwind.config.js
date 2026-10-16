/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
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
}
