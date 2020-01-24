import { Config } from '~/common'
import fs from 'fs'
import { promisify } from 'util'
import * as path from 'path'

const writeFile = promisify(fs.writeFile)

async function main() {
  await writeFile(
    path.resolve('channel', 'app.json'),
    JSON.stringify(Config, null, 2),
    'utf8',
  )
}

export default main()
