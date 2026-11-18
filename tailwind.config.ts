import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        card: "rgba(22, 22, 26, 0.75)",
        glass: "rgba(255, 255, 255, 0.08)",
        glassHover: "rgba(255, 255, 255, 0.15)",
        glassActive: "rgba(255, 255, 255, 0.22)",
        callGreen: "#34C759",
        callRed: "#FF3B30",
        appleGray: {
          100: "#F2F2F7",
          200: "#E5E5EA",
          300: "#D1D1D6",
          400: "#C7C7CC",
          500: "#AEAEB2",
          600: "#8E8E93",
          700: "#636366",
          800: "#48484A",
          900: "#1C1C1E",
          950: "#0D0D0E",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 20px rgba(52, 199, 89, 0.4)",
        activeSpeaker: "0 0 0 3px #34C759, 0 0 25px rgba(52, 199, 89, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        pulseSpeaker: "pulseSpeaker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        pulseSpeaker: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
