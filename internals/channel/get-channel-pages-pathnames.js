const fs = require('fs')
const path = require('path')

module.exports = function getChannelPagesPathnames() {
  try {
    fs.statSync('pages/channel')
  } catch (error) {
    return []
  }

  return fs
    .readdirSync(path.resolve('pages/channel'))
    .map(filename => `/${path.basename(filename, path.extname(filename))}`)
}
