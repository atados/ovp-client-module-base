const path = require('path')
const { execAsync } = require('./utils')

module.exports = async () => {
  await execAsync('yarn', ['export:config'])
  return require(path.resolve('channel', 'generated', 'app.json'))
}
