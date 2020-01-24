const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

module.exports = {
  target: 'serverless',
  env: {
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