/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tgpu: {
          navy:   '#0A1628',
          blue:   '#1E3A5F',
          gold:   '#C9A84C',
          amber:  '#F0A500',
          light:  '#EEF2F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
