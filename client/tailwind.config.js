/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF2F7',
          100: '#D6E0EC',
          400: '#3C5F82',
          600: '#254A6B',
          700: '#1E3A5F',
          900: '#101F33',
        },
        clay: {
          400: '#D98E5B',
          500: '#C97A46',
        },
        cream: '#F7F5F0',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
