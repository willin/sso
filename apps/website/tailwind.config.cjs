/** @type {import('tailwindcss').Config} */
export default {
  content: [
    //
    './src/**/*.{html,svelte,js,ts,md,svx,svelte.md}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  daisyui: {
    themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'sunset', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    themeRoot: ':root' // The element that receives theme color CSS variables
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
