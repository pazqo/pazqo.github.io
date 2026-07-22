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
        // Refn aesthetic - deep blue-purple with electric cyan accent
        jet: 'hsl(230, 20%, 20%)',            // cards
        onyx: 'hsl(230, 22%, 16%)',           // background
        'eerie-black': {
          1: 'hsl(230, 18%, 24%)',            // borders
          2: 'hsl(230, 16%, 28%)',            // hover states
        },
        'smoky-black': 'hsl(230, 25%, 12%)', // deeper bg
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(210, 15%, 95%)',     // main text (cool white)
        'orange-yellow-crayola': 'hsl(185, 85%, 55%)', // electric cyan accent
        'vegas-gold': 'hsl(195, 75%, 50%)',  // secondary cyan
        'light-gray': 'hsl(220, 12%, 72%)',  // muted text
        'light-gray-70': 'hsla(220, 12%, 72%, 0.7)',
        'bittersweet-shimmer': 'hsl(320, 70%, 60%)',
        light: {
          bg: 'hsl(220, 30%, 96%)',
          card: 'hsl(0, 0%, 100%)',
          text: 'hsl(230, 40%, 22%)',
          muted: 'hsl(220, 20%, 45%)',
          accent: 'hsl(185, 75%, 40%)',
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
        // Refn gradients - deep blue-purple with cyan accents
        'gradient-onyx': 'linear-gradient(to bottom right, hsl(230, 22%, 18%) 3%, hsl(230, 25%, 12%) 97%)',
        'gradient-jet': 'linear-gradient(to bottom right, hsla(230, 25%, 30%, 0.5) 0%, hsla(230, 22%, 20%, 0) 100%), hsl(230, 20%, 20%)',
        'gradient-yellow': 'linear-gradient(to right, hsl(185, 85%, 55%), hsl(200, 80%, 50%))',
        'border-gradient-onyx': 'linear-gradient(to bottom right, hsl(185, 60%, 45%) 0%, hsla(230, 22%, 24%, 0) 50%)',
      },
      boxShadow: {
        'shadow-1': '-4px 8px 24px hsla(230, 40%, 6%, 0.45)',
        'shadow-2': '0 16px 30px hsla(230, 40%, 6%, 0.45)',
        'shadow-3': '0 16px 40px hsla(230, 40%, 6%, 0.5)',
        'shadow-4': '0 25px 50px hsla(230, 40%, 6%, 0.35)',
        'shadow-5': '0 24px 80px hsla(230, 40%, 6%, 0.45)',
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
