/** @type {import('tailwindcss').Config} */

const { colors } = require('./utils/style/colors');

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors,
    fontFamily: {
      raleway: ['Raleway', 'sans-serif'],
      ralewayItalic: ['RalewayItalic', 'sans-serif'],
      ralewayBold: ['RalewayBold', 'sans-serif'],
      ralewayBoldItalic: ['RalewayBoldItalic', 'sans-serif'],
      ralewayExtraBold: ['RalewayExtraBold', 'sans-serif'],
      ralewayExtraBoldItalic: ['RalewayExtraBoldItalic', 'sans-serif'],
      ralewayMedium: ['RalewayMedium', 'sans-serif'],
      ralewayMediumItalic: ['RalewayMediumItalic', 'sans-serif'],
      ralewayLight: ['RalewayLight', 'sans-serif'],
      ralewayLightItalic: ['RalewayLightItalic', 'sans-serif'],
      ralewayRegular: ['RalewayRegular', 'sans-serif'],
      ralewaySemiBold: ['RalewaySemiBold', 'sans-serif'],
      ralewaySemiBoldItalic: ['RalewaySemiBoldItalic', 'sans-serif'],
      ralewayThin: ['RalewayThin', 'sans-serif'],
      ralewayThinItalic: ['RalewayThinItalic', 'sans-serif'],
    },
    extend: {
      borderWidth: {
        1: '1px', // Adding a 1px border width
      },
    },
  },
  plugins: [],
};
