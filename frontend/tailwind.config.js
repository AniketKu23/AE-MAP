/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#1A1B26",
        panel: "#24283B",
        textPrimary: "#CDD6F4",
        lavender: "#CBA6F7",
        mint: "#A6E3A1",
        rose: "#F5C2E7",
        dustyBlue: "#89B4FA",
        borderSubtle: "rgba(205, 214, 244, 0.14)",
        textMuted: "rgba(205, 214, 244, 0.68)"
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        pastel: "0 18px 60px rgba(0, 0, 0, 0.28)",
        lavender: "0 0 32px rgba(203, 166, 247, 0.18)"
      }
    }
  },
  plugins: []
};
