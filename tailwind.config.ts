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
        jet: 'hsl(220, 20%, 22%)',
        onyx: 'hsl(220, 10%, 17%)',
        'eerie-black': {
          1: 'hsl(210, 32%, 13%)',
          2: 'hsl(210, 32%, 25%)',
        },
        'smoky-black': 'hsl(200, 66%, 15%)',
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(0, 0%, 98%)',
        'orange-yellow-crayola': 'hsl(45, 100%, 72%)',
        'vegas-gold': 'hsl(45, 54%, 58%)',
        'light-gray': 'hsl(0, 0%, 84%)',
        'light-gray-70': 'hsla(0, 0%, 84%, 0.7)',
        'bittersweet-shimmer': 'hsl(0, 43%, 51%)',
        light: {
          bg: 'hsl(210, 20%, 98%)',
          card: 'hsl(0, 0%, 100%)',
          text: 'hsl(220, 20%, 22%)',
          muted: 'hsl(220, 10%, 40%)',
          accent: 'hsl(45, 100%, 45%)',
        },
      },
      backgroundImage: {
        'gradient-onyx': 'linear-gradient(to bottom right, hsl(240, 1%, 25%) 3%, hsl(0, 0%, 19%) 97%)',
        'gradient-jet': 'linear-gradient(to bottom right, hsla(240, 33%, 18%, 0.251) 0%, hsla(240, 43%, 11%, 0) 100%), hsl(240, 43%, 13%)',
        'gradient-yellow': 'linear-gradient(to right, hsl(45, 100%, 72%), hsl(35, 100%, 68%))',
        'border-gradient-onyx': 'linear-gradient(to bottom right, hsl(0, 0%, 25%) 0%, hsla(0, 0%, 25%, 0) 50%)',
      },
      boxShadow: {
        'shadow-1': '-4px 8px 24px hsla(0, 0%, 0%, 0.25)',
        'shadow-2': '0 16px 30px hsla(0, 0%, 0%, 0.25)',
        'shadow-3': '0 16px 40px hsla(0, 0%, 0%, 0.25)',
        'shadow-4': '0 25px 50px hsla(0, 0%, 0%, 0.15)',
        'shadow-5': '0 24px 80px hsla(0, 0%, 0%, 0.25)',
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
