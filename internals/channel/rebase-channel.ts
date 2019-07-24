import * as fs from 'fs'
import * as globModule from 'glob'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as rimrafModule from 'rimraf'
import { promisify } from 'util'
import { writeFile } from './utils'

const glob = promisify(globModule)
const rimraf = promisify(rimrafModule)

const basePagesDirname = path.resolve('base', 'pages')
export default async function() {
  const files = await glob(path.resolve(basePagesDirname, '**', '*'))
  await rimraf(path.resolve('pages', 'base'))
  mkdirp.sync(path.resolve('pages', 'base'))

  files.map(async filename => {
    const targetFilename = filename.substr(basePagesDirname.length + 1)
    try {
      fs.statSync(path.resolve('pages', targetFilename))
    } catch (error) {
      await writeFile(
        path.resolve('pages', 'base', targetFilename),
        `export { default } from '~/pages/${path.basename(
          targetFilename,
          path.extname(targetFilename),
        )}'`,
      )
    }
  })

  const basePkg = require(path.resolve('base', 'base-package.json'))
  const pkg = require(path.resolve('package.json'))

  pkg.channel = pkg.channel || {}

  writeFile(
    path.resolve('package.json'),
    JSON.stringify(
      {
        ...pkg,
        scripts: {
          ...basePkg.scripts,
          ...pkg.channel.scripts,
        },
        husky: {
          ...pkg.husky,
          ...basePkg.husky,
        },
        jest: {
          ...pkg.jest,
          ...basePkg.jest,
        },
        'lint-staged': {
          ...pkg['lint-staged'],
          ...basePkg['lint-staged'],
        },
        dependencies: {
          ...basePkg.dependencies,
          ...pkg.channel.dependencies,
        },
        devDependencies: {
          ...basePkg.devDependencies,
          ...pkg.channel.devDependencies,
        },
      },
      null,
      2,
    ),
  )
}
