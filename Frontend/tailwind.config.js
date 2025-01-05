import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue': '#011222',
      },
      spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%, 100%': { transform: 'rotate(360deg)' },
        },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
    ]
  }
};