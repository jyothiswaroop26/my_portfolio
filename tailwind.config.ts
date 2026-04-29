import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08080c",
          2: "#0f0f17",
          3: "#16161f",
        },
        fg: {
          DEFAULT: "#f5f5f7",
          dim: "#8a8a99",
          mute: "#4a4a55",
        },
        accent: {
          DEFAULT: "#c8ff3e",
          2: "#6b5cff",
          3: "#ff5cb1",
          4: "#ffaa3e",
        },
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
      },
      animation: {
        "blink": "blink 2s ease infinite",
        "marquee": "marquee 30s linear infinite",
        "scroll-down": "scrollDown 2s ease infinite",
        "mesh-float": "meshFloat 20s ease infinite",
        "load-bar": "loadBar 1.4s cubic-bezier(0.65, 0, 0.35, 1) forwards",
        "pulse-soft": "pulseSoft 1.5s ease infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        blink: {
          "50%": { opacity: "0.3" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        scrollDown: {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
        meshFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(50px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-40px, 40px) scale(0.95)" },
        },
        loadBar: {
          to: { transform: "translateX(0)" },
        },
        pulseSoft: {
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
