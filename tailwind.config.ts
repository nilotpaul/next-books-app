import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,html,css}',
    './components/**/*.{ts,tsx,html,css}',
    './app/**/*.{ts,tsx,html,css}',
    './src/**/*.{ts,tsx,html,css}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
    },
  },
  plugins: [
    nextui({ addCommonColors: true }),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/typography'),
  ],
};
export default config;
