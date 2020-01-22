const { promisify } = require('util')
const chalk = require('chalk')
const path = require('path')
const ncp = require('ncp')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const createDir = promisify(mkdirp)
const deleteDir = promisify(rimraf)
const copyDir = promisify(ncp)

const outputDir = path.resolve('public', 'generated', 'static')
async function main() {
  await deleteDir(outputDir)
  await createDir(path.resolve('public', 'generated', 'static'))
  await copyDir(path.resolve('base', 'static'), outputDir)

  console.log(
    `> Copied ${chalk.cyan(path.join('base', 'static'))} to ${chalk.cyan(
      path.join('public', 'generated', 'static'),
    )}`,
  )
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
