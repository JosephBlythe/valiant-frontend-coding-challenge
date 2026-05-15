/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Libre Caslon Text"', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(180deg, #fffea8 0%, transparent 100%)',
      },
      colors: {
        primary: 'rgb(255 254 168 / <alpha-value>)',
        'primary-foreground': 'rgb(38 44 45 / <alpha-value>)',
        secondary: 'rgb(248 248 255 / <alpha-value>)',
        'secondary-foreground': 'rgb(38 44 45 / <alpha-value>)',
        danger: 'rgb(220 38 38 / <alpha-value>)',
        'danger-foreground': 'rgb(255 255 255 / <alpha-value>)',
        muted: 'rgb(243 244 246 / <alpha-value>)',
        'muted-foreground': 'rgb(109 118 120 / <alpha-value>)',
        border: 'rgb(229 231 235 / <alpha-value>)',
        success: 'rgb(22 163 74 / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
