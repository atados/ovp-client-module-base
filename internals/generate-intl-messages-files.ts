import * as fs from 'fs'
import prevGlob from 'glob'
import prevMkdirp from 'mkdirp'
import flat from 'flat'
import * as path from 'path'
import { promisify } from 'util'

const glob = promisify(prevGlob)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdirp = promisify(prevMkdirp)

export default async function generateIntlMessagesFiles() {
  const langs = (
    await glob(path.resolve('base', 'lang', '*.json'))
  ).map(filename => path.basename(filename, path.extname(filename)))
  await mkdirp(path.resolve('channel', 'generated', 'lang'))

  const localeDataOutDir = path.resolve('public', 'generated', 'locale-data')
  await mkdirp(localeDataOutDir)

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

      const localeDataOut = path.resolve(localeDataOutDir, `${lang}.js`)
      // tslint:disable-next-line:no-console
      console.log(
        `> Created \'${path.resolve(localeDataOutDir, `${lang}.json`)}\'`,
      )
      return Promise.all([
        writeFile(
          path.resolve('channel', 'generated', 'lang', `${lang}.json`),
          JSON.stringify(flat(messages)),
        ),
        writeFile(
          localeDataOut,
          fs.readFileSync(
            path.resolve(
              'node_modules',
              '@formatjs',
              'intl-relativetimeformat',
              'dist',
              'locale-data',
              `${lang.split('-')[0]}.js`,
            ),
          ),
        ),
      ])
    }),
  )
}
