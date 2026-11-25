import type { Config } from "tailwindcss";

// Brand colours from the Buildit3D logo: electric blue #1399EC and near-black #0A0A0A on white.
export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        mute: "#5a6170",
        line: "#e5e8ee",
        soft: "#f4f7fb",
        brand: { DEFAULT: "#1399ec", deep: "#0a7cc6", soft: "#e7f4fd", ink: "#063a5e" },
        wa: { DEFAULT: "#1fa855", dark: "#178a45" },
      },
      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        sans: ["Inter", "'Noto Sans Devanagari'", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.035em" },
    },
  },
  plugins: [],
} satisfies Config;
