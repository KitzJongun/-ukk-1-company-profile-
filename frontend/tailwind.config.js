/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          500: "#3b82f6",
          600: "#1e3a8a",
          700: "#172554",
          800: "#1e2a4a",
          900: "#0f172a",
        },
        ink: {
          900: "#0f172a",
          700: "#1e293b",
          500: "#475569",
          300: "#94a3b8",
          100: "#e2e8f0",
        },
        rule: "#cbd5e1",
      },
      fontFamily: {
        sans: ["var(--font-source)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-source)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.06)",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};