export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          700: '#0f766e',
          900: '#134e4a',
          DEFAULT: '#0f766e' // deep teal for biotech startup feel
        },
        omics: {
          genomics: '#3b82f6', // blue
          transcriptomics: '#8b5cf6', // purple
          proteomics: '#14b8a6', // teal
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
