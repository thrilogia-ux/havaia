/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5e8f7',
          100: '#e8c5ed',
          200: '#dc9fe3',
          300: '#cf79d9',
          400: '#c352cf',
          500: '#9a4aa6', // Principal - Morado/violeta
          600: '#7b3c85',
          700: '#5c2d64',
          800: '#3d1e43',
          900: '#1e0f22',
        },
        secondary: {
          50: '#feecec',
          100: '#fcc9ca',
          200: '#faa6a8',
          300: '#f88386',
          400: '#f66064',
          500: '#fb6063', // Secundario - Rosa/Rojo claro
          600: '#c94d4f',
          700: '#973a3b',
          800: '#642627',
          900: '#321314',
        },
        accent: {
          50: '#f0f8ed',
          100: '#d4edc8',
          200: '#b8e2a3',
          300: '#9cd77e',
          400: '#80cc59',
          500: '#a5df7e', // Botones especiales - Verde claro
          600: '#84b265',
          700: '#63864c',
          800: '#425932',
          900: '#212c19',
        },
      },
      fontFamily: {
        sans: ['var(--font-lexend-deca)', 'Lexend Deca', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #9a4aa6, #fb6063)',
        'gradient-primary-reverse': 'linear-gradient(to right, #fb6063, #9a4aa6)',
      },
    },
  },
  plugins: [],
}
