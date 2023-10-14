import { defineConfig } from 'unocss'

export default defineConfig({
  // GEEN THEME!
  // wel manifesteren van genereren css
  safelist: [...Array.from({ length: 100 }, (_, i) => `left-[${i + 1}%]`)],
  theme: {
    colors: {
      secondary: {
        DEFAULT: '#F5CB5C',
        100: '#FAE8B8',
        300: '#FAE7B2',
        400: '#F5CB5C', // active
        600: '#F0B719',

        light: '#FAE7B2',
        lighter: '#FAE8B8',
        dark: '#F0B719',
        surface: '#FEFCF6',
      },
      primary: {
        DEFAULT: '#386FA4',
        light: '#ADD7F6',
        surface: '#F5F7FA',
        text: '#133C55',
        medium: '#073978',
        dark: '#0A1004',
      },
    },
  },
})
