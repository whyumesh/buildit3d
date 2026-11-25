import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1f5fbf", dark: "#163f7d", soft: "#e8f0fb" },
        ink: "#1c2430",
        wa: { DEFAULT: "#1fa855", dark: "#178a45" },
      },
      fontFamily: {
        sans: ["Poppins", "Noto Sans Devanagari", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
