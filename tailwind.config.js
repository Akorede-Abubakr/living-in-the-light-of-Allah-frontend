/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F0F9F4',
          100: '#E8F6ED',
          200: '#D4EDDC',
          300: '#A3DAB7',
          400: '#0A8D3E', // Lighter Emerald Hover
          500: '#077432', // Lighter Emerald Primary Brand
          600: '#06632B',
          700: '#055224',
          800: '#04421D',
          900: '#033116',
          gold: '#C6A15B', // Soft Gold
        },
        ink: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F8F5ED',
          300: '#DDE8E1',
          400: '#878680',
          500: '#64635D',
          600: '#4D4C47',
          700: '#383733',
          800: '#282D2A',
          900: '#202522', // Charcoal Text
          950: '#111413',
        },
        sage: {
          50: '#F8FAF9',
          100: '#DDE8E1',
          200: '#C7D7CD',
          500: '#1F5C50',
          700: '#123C35',
        },
        gold: {
          50: '#FCF9F0',
          100: '#F5EDD5',
          400: '#D8B878',
          500: '#C6A15B',
          600: '#A9833C',
        }
      },
      boxShadow: {
        'book': '0 12px 30px -10px rgba(18, 60, 53, 0.25), 0 4px 10px -4px rgba(18, 60, 53, 0.15)',
        'book-lg': '0 20px 45px -12px rgba(18, 60, 53, 0.35), 0 6px 16px -6px rgba(18, 60, 53, 0.2)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'float': '0 20px 40px -15px rgba(18, 60, 53, 0.12)',
      },
      borderRadius: {
        'book': '4px',
      }
    },
  },
  plugins: [],
}
