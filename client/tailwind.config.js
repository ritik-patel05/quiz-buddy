module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        '7030': '70% 30%',
        'auto-40': 'repeat(auto-fill, 40px)'
      },
      gridTemplateRows: {
        '3x': '72px 1fr auto' 
      },
      colors: {
        'divider': '#E9EEF2',
        'primary': '#3C4852',
        'base-0': '#FCFCFC',
        'base-1': '#FFFFFF'
      }
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
    minWidth: {
      '6xl': '72rem',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
  important: true,
};
