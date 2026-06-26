import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18211f',
        moss: '#4f675b',
        mint: '#d7eadf',
        clay: '#b76144',
        paper: '#faf8f3'
      }
    }
  },
  plugins: []
};

export default config;
