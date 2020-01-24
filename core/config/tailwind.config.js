const path = require('path')
const config = require(path.resolve('channel', 'app.json'))

module.exports = {
  important: true,
  theme: {
    extend: {
      colors: {
        ...config.theme.color,
      },
    },
    fontFamily: {
      sans: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        'Helvetica',
        'Arial',
      ],
    },
  },
  variants: {
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    },
  },
  plugins: [],
}
