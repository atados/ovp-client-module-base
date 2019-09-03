import * as fs from 'fs'
import prevGlob from 'glob'
import prevMkdirp from 'mkdirp'
import * as path from 'path'
import { promisify } from 'util'

const glob = promisify(prevGlob)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdirp = promisify(prevMkdirp)

export default async function createLangFile() {
  const langs = (await glob(path.resolve('base', 'lang', '*.json'))).map(
    filename => path.basename(filename, path.extname(filename)),
  )
  await mkdirp(path.resolve('static', 'dist', 'lang'))
  await mkdirp(path.resolve('static', 'dist', 'locale-data'))

  return Promise.all(
    langs.map(async lang => {
      const fileBody = await readFile(
        path.resolve('base', 'lang', `${lang}.json`),
        'utf8',
      )
      const messages = JSON.parse(fileBody)

      try {
        const channelMessages = await readFile(
          path.resolve('channel', 'lang', `${lang}.json`),
          'utf8',
        )
        Object.assign(messages, JSON.parse(channelMessages))
      } catch (error) {
        // ...
      }

      const out = path.resolve('static', 'dist', 'lang', `${lang}.json`)
      const localeDataOut = path.resolve(
        'static',
        'dist',
        'locale-data',
        `${lang}.js`,
      )
      // tslint:disable-next-line:no-console
      console.log(
        `> Created \'${path.resolve(
          'static',
          'dist',
          'lang',
          `${lang}.json`,
        )}\'`,
      )
      return Promise.all([
        writeFile(out, JSON.stringify(messages)),
        writeFile(
          localeDataOut,
          fs.readFileSync(
            path.resolve(
              'node_modules',
              'react-intl',
              'locale-data',
              `${lang.split('-')[0]}.js`,
            ),
          ),
        ),
      ])
    }),
  )
}
