/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tgpu: {
          navy:   '#052E25',
          blue:   '#047857',
          gold:   '#34D399',
          amber:  '#10B981',
          light:  '#F0FDF4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
