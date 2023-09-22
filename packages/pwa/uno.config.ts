import { defineConfig } from 'unocss'

export default defineConfig({
  // GEEN THEME!
  // wel manifesteren van genereren css
  theme: {
    colors: {
      secondary: {
        DEFAULT: '#F5CB5C',
        light: '#FAE7B2',
        lighter: '#FAE8B8',
        dark: '#F0B719',
        surface: '#FEFCF6',
      },
      primary: {
        DEFAULT: '#386FA4',
        light: '#ADD7F6',
        surface: '#F5F7FA',
        text: '#0A1004',
      },
    },
  },
})
