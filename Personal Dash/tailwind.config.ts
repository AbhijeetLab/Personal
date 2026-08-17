import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0D13",
        surface: "#12161F",
        surface2: "#171C27",
        surface3: "#1D2330",
        border: "#232838",
        borderLight: "#2C3244",
        text: {
          primary: "#E7E9EE",
          secondary: "#8A93A6",
          tertiary: "#565E70",
        },
        gold: {
          DEFAULT: "#C9A961",
          dim: "#3A3221",
          bright: "#E4C67F",
        },
        work: {
          DEFAULT: "#5B8DEF",
          dim: "#1B2439",
        },
        family: {
          DEFAULT: "#F0A93A",
          dim: "#332510",
        },
        personal: {
          DEFAULT: "#4ADE80",
          dim: "#132A1D",
        },
        danger: {
          DEFAULT: "#F0576A",
          dim: "#331419",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        popIn: { "0%": { opacity: "0", transform: "scale(0.97)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        slideUp: "slideUp 0.25s ease-out",
        popIn: "popIn 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
