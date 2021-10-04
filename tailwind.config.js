module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minHeight: {
      '1/5': '20%',
      '1/4': '25%',
    },
    plugins: [require('@tailwindcss/forms')],
  },
  variants: {
    extend: {
      ringWidth: ['hover', 'active', 'focus'],
    },
  },
  plugins: [],
};
