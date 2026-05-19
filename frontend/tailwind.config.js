/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#f3fcef',
        'primary': '#006e2f',
        'bottle-green': '#1a4d2e',
        'surface-container': '#e8f0e4',
        'on-primary': '#ffffff',
        'error': '#ba1a1a',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
