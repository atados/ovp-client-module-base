import { Config } from '~/common'
import fs from 'fs'
import legacyMkdirp from 'mkdirp'
import { promisify } from 'util'
import * as path from 'path'
import chalk from 'chalk'

const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(legacyMkdirp)
const isTestEnv = process.env.NODE_ENV === 'test'

const outputDir = path.join('channel', 'generated')

export async function main() {
  await mkdirp(path.resolve(outputDir))
  await writeFile(
    path.resolve(outputDir, 'app.json'),
    JSON.stringify(Config, null, 2),
    'utf8',
  )

  if (!isTestEnv) {
    // tslint:disable-next-line no-console
    console.log(`> Writing ${chalk.cyan(path.join(outputDir, 'app.json'))}`)
  }
}

if (process.argv.includes('--run')) {
  main().catch(error => {
    if (error) {
      console.error(error)
      process.exit(1)
    }
  })
}
