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
        // Purple AI theme - medium-dark with vibrant accents
        jet: 'hsl(260, 20%, 18%)',           // cards
        onyx: 'hsl(260, 25%, 12%)',          // background
        'eerie-black': {
          1: 'hsl(260, 20%, 22%)',           // borders
          2: 'hsl(260, 20%, 24%)',           // hover states
        },
        'smoky-black': 'hsl(260, 25%, 8%)',  // deeper bg
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(260, 20%, 95%)',     // main text (light)
        'orange-yellow-crayola': 'hsl(270, 80%, 65%)', // vibrant purple accent
        'vegas-gold': 'hsl(280, 70%, 55%)',  // secondary purple
        'light-gray': 'hsl(260, 15%, 75%)',  // muted text
        'light-gray-70': 'hsla(260, 15%, 75%, 0.7)',
        'bittersweet-shimmer': 'hsl(340, 65%, 55%)', // pink-red for contrast
        light: {
          bg: 'hsl(260, 20%, 95%)',
          card: 'hsl(0, 0%, 100%)',
          text: 'hsl(260, 30%, 20%)',
          muted: 'hsl(260, 15%, 45%)',
          accent: 'hsl(270, 80%, 55%)',
        },
      },
      backgroundImage: {
        'gradient-onyx': 'linear-gradient(to bottom right, hsl(260, 20%, 16%) 3%, hsl(260, 25%, 10%) 97%)',
        'gradient-jet': 'linear-gradient(to bottom right, hsla(270, 30%, 25%, 0.5) 0%, hsla(260, 25%, 15%, 0) 100%), hsl(260, 20%, 18%)',
        'gradient-yellow': 'linear-gradient(to right, hsl(270, 80%, 65%), hsl(290, 80%, 60%))',
        'border-gradient-onyx': 'linear-gradient(to bottom right, hsl(270, 40%, 35%) 0%, hsla(260, 20%, 20%, 0) 50%)',
      },
      boxShadow: {
        'shadow-1': '-4px 8px 24px hsla(260, 50%, 5%, 0.4)',
        'shadow-2': '0 16px 30px hsla(260, 50%, 5%, 0.4)',
        'shadow-3': '0 16px 40px hsla(260, 50%, 5%, 0.5)',
        'shadow-4': '0 25px 50px hsla(260, 50%, 5%, 0.3)',
        'shadow-5': '0 24px 80px hsla(260, 50%, 5%, 0.4)',
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
