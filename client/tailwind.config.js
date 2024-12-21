/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui,],
  daisyui: {
    themes: ["retro", "halloween", "garden", "autumn", "nord", "cupcake",
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          primary: "#ffce67",
          secondary: "#b8e3c8",
          neutral: "#ef798a",
          accent: "#68cd3f",
          "secondary-content": "#000000",
          "neutral-content": "#000000",
        },
      },
      {
        halloween: {
          ...require("daisyui/src/theming/themes")["halloween"],
          neutral: "#B81C21",
        },
      }
    ],


  },
  fontFamily: {
    'body': [
      'sans-serif',
    ],
  }
}