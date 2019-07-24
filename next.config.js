const fs = require('fs')
const path = require('path')
const withTypescript = require('@zeit/next-typescript')
const dotenv = require('dotenv')
const loadChannelConfig = require('./internals/channel/load-channel-config')
const buildStylesIfNotExist = require('./internals/build-styles-if-not-exists')
const getChannelPagesPathnames = require('./internals/channel/get-channel-pages-pathnames')
const fetchSocketApiFragments = require('./internals/fetch-socket-api-fragments')

const channel = loadChannelConfig()

// Load environment variables
dotenv.config()

module.exports = withTypescript({
  serverRuntimeConfig: {
    staticDistDirname: `${Math.random()
      .toString(36)
      .substring(7)}-${Date.now()}`,
  },
  publicRuntimeConfig: {
    channel,
    channelPages: getChannelPagesPathnames(),
    socketApiURL: process.env.SOCKET_API_URL || 'http://localhost:3002',
    socketApiWsURL: process.env.SOCKET_API_WS_URL || 'ws://localhost:3002',
    apiURL: process.env.API_URL || 'http://localhost:8000',
    appURL: process.env.APP_URL || 'http://localhost:3000',
    appShareURL: process.env.APP_SHARE_URL || 'http://localhost:3000',
  },
  // useFileSystemPublicRoutes: false,
  webpack(config, { isServer, dev }) {
    if (channel.config.chat.enabled) {
      fetchSocketApiFragments(channel)
    }

    // Every code in this scope will only run once
    if (isServer) {
      if (dev) {
        buildStylesIfNotExist()
      } else {
        // Add type-checking on build
        const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
        config.plugins.push(
          new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve('tsconfig.json'),
          }),
        )
      }
    }

    // Add alias to webpack so we can import by: ~/components, ~/lib, etc..
    // and override base components
    const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
    config.resolve.plugins = [new TsconfigPathsPlugin()]

    return config
  },
})
