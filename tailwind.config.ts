import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        telugu: [
          "var(--font-telugu)",
          "Noto Sans Telugu",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        "display-te": [
          "var(--font-display-te)",
          "Suranna",
          "var(--font-telugu)",
          "Noto Sans Telugu",
          "serif",
        ],
      },
      lineHeight: {
        telugu: "1.75",
      },
      colors: {
        canvas: "#FBFBFA",
        surface: "#ffffff",
        ink: "#0F172A",
        muted: "#71717A",
        line: "#EBE8E0",
        warm: "#F4F2EB",
        brand: {
          DEFAULT: "#C2410C",
          hover: "#9A3412",
        },
        sos: "#dc2626",
        civic: {
          paper: "#FBFBFA",
          subtle: "#F4F4F2",
          border: "#E2E8F0",
          ink: "#0F172A",
          navy: "#1E293B",
          bronze: "#B45309",
          "bronze-hover": "#92400E",
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "chat-pulse": "chat-pulse 2s ease-out infinite",
        float: "float 4s ease-in-out infinite",
        "float-card": "float-card 4s ease-in-out infinite",
        "shadow-bloom": "shadow-bloom 4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "chat-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(194 65 12 / 0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgb(194 65 12 / 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(-4px)" },
          "50%": { transform: "translateY(4px)" },
        },
        "float-card": {
          "0%, 100%": { transform: "translateY(3px)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "shadow-bloom": {
          "0%, 100%": {
            boxShadow:
              "0 10px 24px rgb(15 23 42 / 0.12), 0 0 0 1px rgb(180 83 9 / 0.12)",
          },
          "50%": {
            boxShadow:
              "0 16px 36px rgb(15 23 42 / 0.18), 0 0 28px rgb(180 83 9 / 0.18)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
