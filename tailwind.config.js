/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E2BAD', // Blue Pigment
          dark: '#213F8E', // Dark Cornflower Blue
          light: '#1E617D', // Blue Sapphire
        },
        secondary: {
          DEFAULT: '#1A749B', // Celadon Blue
          dark: '#0F4368', // Indigo Dye
          light: '#146D7B', // Ming
        },
        accent: {
          DEFAULT: '#DEEDF4', // Alice Blue
          dark: '#1C938C', // Dark Cyan
        },
        text: {
          DEFAULT: '#2A2A2A', // Jet Black
        },
        menu: {
          DEFAULT: '#4845CB', // Menu label color
        }
      },
      fontSize: {
        'display-large': '96px',
        'display-medium': '64px',
        'display-small': '48px',
        'h1': '34px',
        'h2': '24px',
        'h3': '22px',
        'h4': '18px',
        'body': '18px',
        'body-tiny': '14px',
        'menu-label': '13px',
        'label': '16px',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['HK Grotesk Pro', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 4px 24px rgba(0, 0, 0, 0.16)',
        'card-up': '0px -2px 24px rgba(0, 0, 0, 0.16)',
        'card-subtle': '0px 4px 16px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        'mobile': '375px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
        'gradient-counter': 'linear-gradient(99.46deg, #3B57AC -1.87%, #0D2778 99.03%)',
      }
    },
  },
  plugins: [],
}

