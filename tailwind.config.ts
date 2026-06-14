import type { Config } from "tailwindcss";

/**
 * Tailwind config cho web-wedding. Token màu/định dạng dùng CSS variables khai
 * báo trong `client/global.css` (single source of truth) — đổi theme chỉ sửa CSS.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./client/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        gold: "hsl(var(--gold) / <alpha-value>)",
        rose: "hsl(var(--rose) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        // Body / UI
        sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
        // Tên cặp đôi, tiêu đề lãng mạn (script)
        script: ["Great Vibes", "cursive"],
        // Heading trang trọng (serif)
        serif: ["Playfair Display", "serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0.9" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        fall: "fall linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
