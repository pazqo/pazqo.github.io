import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Dusk Purple theme - brighter dark with purple accents
        jet: 'hsl(260, 15%, 38%)',            // cards
        onyx: 'hsl(260, 18%, 30%)',           // background
        'eerie-black': {
          1: 'hsl(260, 14%, 42%)',            // borders
          2: 'hsl(260, 14%, 45%)',            // hover states
        },
        'smoky-black': 'hsl(260, 18%, 25%)', // deeper bg
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(260, 10%, 95%)',     // main text (brighter)
        'orange-yellow-crayola': 'hsl(270, 80%, 72%)', // brighter purple accent
        'vegas-gold': 'hsl(280, 75%, 65%)',  // secondary purple
        'light-gray': 'hsl(260, 10%, 75%)',  // muted text (brighter)
        'light-gray-70': 'hsla(260, 10%, 75%, 0.7)',
        'bittersweet-shimmer': 'hsl(340, 65%, 65%)',
        light: {
          bg: 'hsl(260, 30%, 96%)',
          card: 'hsl(0, 0%, 100%)',
          text: 'hsl(260, 40%, 25%)',
          muted: 'hsl(260, 20%, 50%)',
          accent: 'hsl(270, 70%, 55%)',
        },
      },
      backgroundImage: {
        // Dusk Purple gradients
        'gradient-onyx': 'linear-gradient(to bottom right, hsl(260, 18%, 28%) 3%, hsl(260, 18%, 25%) 97%)',
        'gradient-jet': 'linear-gradient(to bottom right, hsla(270, 22%, 45%, 0.5) 0%, hsla(260, 18%, 35%, 0) 100%), hsl(260, 15%, 38%)',
        'gradient-yellow': 'linear-gradient(to right, hsl(270, 80%, 72%), hsl(290, 80%, 68%))',
        'border-gradient-onyx': 'linear-gradient(to bottom right, hsl(270, 45%, 55%) 0%, hsla(260, 18%, 40%, 0) 50%)',
      },
      boxShadow: {
        'shadow-1': '-4px 8px 24px hsla(260, 40%, 10%, 0.35)',
        'shadow-2': '0 16px 30px hsla(260, 40%, 10%, 0.35)',
        'shadow-3': '0 16px 40px hsla(260, 40%, 10%, 0.4)',
        'shadow-4': '0 25px 50px hsla(260, 40%, 10%, 0.25)',
        'shadow-5': '0 24px 80px hsla(260, 40%, 10%, 0.35)',
      },
      fontSize: {
        'fs-1': '24px',
        'fs-2': '18px',
        'fs-3': '17px',
        'fs-4': '16px',
        'fs-5': '15px',
        'fs-6': '14px',
        'fs-7': '13px',
        'fs-8': '11px',
      },
      borderRadius: {
        '14': '14px',
        '16': '16px',
        '20': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
