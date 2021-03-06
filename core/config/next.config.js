const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

const DEFAULT_LOCALE = 'pt-br'
const locale = process.env.LOCALE || DEFAULT_LOCALE

module.exports = {
  target: 'serverless',
  env: {
    INTL_JSON: JSON.stringify({
      locale: locale,
      localeData: getLocaleData(),
      messages: getIntlMessages(locale),
    }),
    LOGGING: process.env.NODE_LOGGING,
    SOCKET_API_URL: process.env.SOCKET_API_URL || 'http://localhost:3002',
    SOCKET_API_WS_URL: process.env.SOCKET_API_WS_URL || 'ws://localhost:3002',
    API_URL: process.env.API_URL || 'http://localhost:8000',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID || 'client',
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET || 'secret',
    APP_SHARE_URL: process.env.APP_SHARE_URL || 'http://localhost:3000',
    NOW_GITHUB_COMMIT_SHA: process.env.NOW_GITHUB_COMMIT_SHA || '',
    NOW_GITHUB_COMMIT_DIRTY: process.env.NOW_GITHUB_COMMIT_DIRTY || '',
  },
  webpack(config, { dev }) {
    if (dev) {
      // Remove type-checking at development
      config.plugins = config.plugins.filter(
        plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin',
      )
    }

    // Disable CSS import support
    config.module.rules.push({
      test: /\.css$/,
      loader: 'null-loader',
    })

    // Add alias to webpack so we can import by: ~/components, ~/lib, etc..
    // and override base components
    const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
    config.resolve.plugins = [new TsconfigPathsPlugin()]

    return config
  },
}

function getIntlMessages(locale) {
  const messages =
    locale !== DEFAULT_LOCALE
      ? require(path.resolve('base', 'lang', `${locale}.json`))
      : {}

  try {
    Object.assign(
      messages,
      require(path.resolve('channel', 'lang', 'default.json')),
    )
  } catch (error) {}

  try {
    Object.assign(
      messages,
      require(path.resolve('channel', 'lang', `${locale}.json`)),
    )
  } catch (error) {}

  return messages
}

function getLocaleData() {
  let extractedLocaleData
  const prevIntlPolyfill = global.IntlPolyfill
  global.IntlPolyfill = {
    __addLocaleData: value => {
      extractedLocaleData = value
    },
  }

  const [language, country] = locale.split('-')
  const moduleName = `${language}-${country.toUpperCase()}.js`
  require(`intl/locale-data/jsonp/${moduleName}`)
  global.IntlPolyfill = prevIntlPolyfill
  return extractedLocaleData
}
