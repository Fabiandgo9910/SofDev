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
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        gradientMove: "gradientMove 8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
