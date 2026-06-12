/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        lc: {
          orange: "#FFA116",
          green: "#00B8A3",
          yellow: "#FFB800",
          red: "#EF4743",
          blue: "#5A8DEE",
          purple: "#A78BFA",
          dark: "#1A1A2E",
          darker: "#0F0F23",
          card: "#16213E",
          border: "#2A2D3E",
          muted: "#A0AEC0",
        },
      },
      animation: {
        "gradient-x": "gradient-x 4s ease infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "count-up": "countUp 1.5s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundSize: {
        "200%": "200%",
      },
    },
  },
  plugins: [],
};
