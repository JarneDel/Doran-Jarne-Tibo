import { defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // GEEN THEME!
  // wel manifesteren van genereren css
  safelist: [...Array.from({ length: 100 }, (_, i) => `left-[${i + 1}%]`)],
  transformers: [transformerDirectives()],
  theme: {
    maxWidth: {
      '3xs': '12rem',
      '2xs': '16rem',
    },
    colors: {
      sports: {
        DEFAULT: '#BE95C4',
      },
      rooms: {
        DEFAULT: '#7EBDC3',
      },
      materials: {
        DEFAULT: '#98B195',
      },
      secondary: {
        DEFAULT: '#F5CB5C',
        100: '#FAE8B8',
        300: '#FAE7B2',
        400: '#f5db93', // active
        500: '#F0B719',
        600: '#F0B719',

        light: '#FAE7B2',
        lighter: '#FAE8B8',
        dark: '#F0B719',
        surface: '#fcfcf7',
      },
      primary: {
        DEFAULT: '#386FA4',
        light: '#ADD7F6',
        lighter: '#E7F1F9',
        surface: '#F5F7FA',
        text: '#133C55',
        medium: '#073978',
        dark: '#0A1004',
      },
      neutral: {
        DEFAULT: '#f5f9ff',
        100: '#fff5f5',
        200: '#e6e6e6',
      },
      danger: {
        DEFAULT: '#EF4444',
        active: '#e65e69',
        surface: '#ffd9da',
        light: '#ffb3b5',
      },
    },
  },
})
