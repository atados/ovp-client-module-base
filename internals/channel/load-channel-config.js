const channelConfig = require('../../../channel.json')
const channelConfigSchema = require('./channel-config-schema')

module.exports = () => {
  const channel = channelConfigSchema.cast(channelConfig)

  // Validate channel
  try {
    channelConfigSchema.validateSync(channel)
  } catch (error) {
    console.log("Invalid 'channel.json' configuration")
    console.error(error)
    process.exit(1)
  }

  return channel
}
