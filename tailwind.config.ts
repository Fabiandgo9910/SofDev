import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6ff",
          100: "#e1eaff",
          300: "#a9c1ff",
          500: "#4d7dff",
          600: "#2f5ef0",
          700: "#233fc2",
          900: "#161c4a",
        },
      },
      backdropBlur: { xs: "2px" },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(var(--orbit-radius,0px)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(var(--orbit-radius,0px)) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-150% 0" },
          "100%": { backgroundPosition: "250% 0" },
        },
        breathe: {
          "0%,100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.06)", opacity: "0.85" },
        },
        riseIn: {
          from: { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        gradientMove: "gradientMove 8s ease infinite",
        orbit: "orbit 14s linear infinite",
        shimmer: "shimmer 3.2s ease-in-out infinite",
        breathe: "breathe 5s ease-in-out infinite",
        "rise-in": "riseIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
