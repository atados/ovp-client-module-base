const channelConfig = require('../../../channel/app.json')
const channelConfigSchema = require('./channel-config-schema')

module.exports = () => {
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
