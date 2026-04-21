import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 6%)",
        foreground: "hsl(210 40% 96%)",
        card: "hsl(222 47% 9%)",
        muted: "hsl(217 33% 18%)",
        accent: "hsl(188 90% 44%)",
        danger: "hsl(0 63% 50%)",
        success: "hsl(142 71% 40%)"
      }
    }
  },
  plugins: []
} satisfies Config;
