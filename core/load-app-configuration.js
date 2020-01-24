const path = require('path')
const exec = require('./utils/run-exec-async')

module.exports = async () => {
  await exec('yarn', ['export:config'])
  return require(path.resolve('channel', 'generated', 'app.json'))
}
