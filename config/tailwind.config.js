const channelConfig = require('../core/channel/load-channel-config')()

module.exports = {
  important: true,
  theme: {
    extend: {
      colors: {
        ...channelConfig.theme.color,
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
