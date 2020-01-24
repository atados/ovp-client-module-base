import { Config } from '~/common'
import fs from 'fs'
import legacyMkdirp from 'mkdirp'
import { promisify } from 'util'
import * as path from 'path'

const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(legacyMkdirp)

async function main() {
  await mkdirp(path.resolve('channel'))
  await writeFile(
    path.resolve('channel', 'generated', 'app.json'),
    JSON.stringify(Config, null, 2),
    'utf8',
  )
}

export default main()
