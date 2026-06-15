// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#5DC840',
          teal: '#29B8C8',
          navy: '#1B2A4A',
          'green-light': '#e8f9e3',
          'teal-light': '#e0f7fa',
        },
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'count-up': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite alternate',
        'count-up': 'count-up 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
