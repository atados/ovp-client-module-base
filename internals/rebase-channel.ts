import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

const copyFile = promisify(fs.copyFile)

export async function run() {
  await copyFile(
    path.resolve('base', 'config', 'tsconfig.json'),
    path.resolve('tsconfig.json'),
  )
  await copyFile(
    path.resolve('base', 'config', 'tsconfig.server.json'),
    path.resolve('tsconfig.server.json'),
  )
  await copyFile(
    path.resolve('base', 'config', 'tslint.json'),
    path.resolve('tslint.json'),
  )
  await copyFile(
    path.resolve('base', 'config', '.prettierrc.json'),
    path.resolve('.prettierrc.json'),
  )
}
