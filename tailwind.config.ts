import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: { dsk: "701px" }, // phones are 700px and narrower
      fontFamily: {
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        body: ['"Cabinet Grotesk"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
