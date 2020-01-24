module.exports = {
  presets: ['next/babel', '@zeit/next-typescript/babel'],
  plugins: [
    'graphql-tag',
    '@babel/plugin-proposal-optional-chaining',
    ['styled-components', { ssr: true }],
  ],
  env: {
    development: {
      plugins: ['react-intl'],
    },
    production: {
      plugins: [
        [
          'react-intl',
          {
            messagesDir: 'channel/generated/.messages/',
          },
        ],
      ],
    },
  },
}
