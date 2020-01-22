const fs = require('fs')
const path = require('path')

module.exports = function syncBasePackage() {
  const { name, ...pkg } = JSON.parse(
    fs.readFileSync(path.resolve('package.json'), 'utf8'),
  )
  const basePkgPath = path.resolve('base', 'config', 'package.json')
  const pkgStr = JSON.stringify(pkg, null, 2)
  const basePkgStr = fs.readFileSync(basePkgPath, 'utf8')
  if (pkgStr !== basePkgStr) {
    console.log(
      require('chalk').green.bold('> Overriding base/config/package.json'),
    )
    fs.writeFileSync(basePkgPath, pkgStr)
  }
}
