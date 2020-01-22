const fs = require('fs')
const channelConfigSchema = require('./channel-config-schema')
const defaultConfig = require('../app.default.json')

const configPath = '../../../channel/app.json'

module.exports = () => {
  let channelConfig = defaultConfig
  let stat
  try {
    stat = fs.statSync(configPath)
  } catch (error) {}

  if (stat && stat.isFile()) {
    Object.assign(channelConfig, require(configPath))
  }

  const channel = channelConfigSchema.cast(channelConfig)

  // Validate channel
  try {
    channelConfigSchema.validateSync(channel)
  } catch (error) {
    console.log("Invalid 'channel/app.json' configuration")
    console.error(error)
    process.exit(1)
  }

  return channel
}
