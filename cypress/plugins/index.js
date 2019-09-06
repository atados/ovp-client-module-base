const path = require('path')
const wp = require('@cypress/webpack-preprocessor')

module.exports = (register, config) => {
  register(
    'on:spec:file:preprocessor',
    wp(config, {
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                  configFile: path.resolve('cypress/tsconfig.json'),
                },
              ],
            },
          ],
        },
      },
    }),
  )
}
