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
        // Neon noir: ink-black surfaces, cyan light, and hot pink accents
        jet: 'hsl(252, 20%, 15%)',            // raised surfaces
        onyx: 'hsl(250, 24%, 9%)',           // recessed surfaces
        'eerie-black': {
          1: 'hsl(252, 19%, 22%)',            // borders
          2: 'hsl(250, 22%, 11%)',            // card surfaces
        },
        'smoky-black': 'hsl(250, 30%, 5%)', // deeper bg
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(260, 30%, 96%)',     // main text (cool white)
        'orange-yellow-crayola': 'hsl(var(--color-accent) / <alpha-value>)', // primary accent
        'vegas-gold': 'hsl(var(--color-secondary) / <alpha-value>)',  // pink secondary accent
        'light-gray': 'hsl(250, 15%, 73%)',  // muted text
        'light-gray-70': 'hsla(250, 15%, 73%, 0.7)',
        'bittersweet-shimmer': 'hsl(326, 100%, 68%)',
        light: {
          bg: 'hsl(265, 35%, 97%)',
          card: 'hsl(0, 0%, 100%)',
          text: 'hsl(255, 30%, 17%)',
          muted: 'hsl(255, 15%, 42%)',
          accent: 'hsl(185, 100%, 27%)',
        },
        // Green theme for Ouroboros
        ouroboros: {
          bg: 'hsl(150, 20%, 12%)',
          'bg-light': 'hsl(150, 25%, 95%)',
          card: 'hsl(150, 18%, 18%)',
          'card-light': 'hsl(150, 20%, 98%)',
          border: 'hsl(150, 15%, 25%)',
          'border-light': 'hsl(150, 20%, 85%)',
          text: 'hsl(150, 15%, 90%)',
          'text-light': 'hsl(150, 30%, 20%)',
          muted: 'hsl(150, 12%, 65%)',
          'muted-light': 'hsl(150, 15%, 45%)',
          accent: 'hsl(145, 65%, 55%)',
          'accent-hover': 'hsl(145, 70%, 45%)',
        },
      },
      backgroundImage: {
        // Neon accents stay concentrated around edges and small details.
        'gradient-onyx': 'linear-gradient(145deg, hsl(265, 26%, 15%), hsl(250, 30%, 7%))',
        'gradient-jet': 'linear-gradient(135deg, hsla(326, 100%, 65%, 0.07), transparent 65%), hsl(250, 22%, 11%)',
        'gradient-yellow': 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
        'border-gradient-onyx': 'linear-gradient(135deg, hsla(185, 100%, 60%, 0.18), hsla(326, 100%, 65%, 0.08) 55%, transparent)',
      },
      boxShadow: {
        'shadow-1': '0 12px 36px hsla(250, 50%, 2%, 0.32), 0 0 0 1px hsla(270, 70%, 75%, 0.025)',
        'shadow-2': '0 12px 30px hsla(250, 50%, 2%, 0.4)',
        'shadow-3': '0 16px 40px hsla(250, 50%, 2%, 0.4)',
        'shadow-4': '0 25px 50px hsla(250, 50%, 2%, 0.3)',
        'shadow-5': '0 24px 80px hsla(250, 50%, 2%, 0.4)',
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
