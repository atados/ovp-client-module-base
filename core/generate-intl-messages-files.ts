import * as fs from 'fs'
import prevGlob from 'glob'
import prevMkdirp from 'mkdirp'
import flat from 'flat'
import * as path from 'path'
import { promisify } from 'util'
import chalk from 'chalk'

const glob = promisify(prevGlob)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdirp = promisify(prevMkdirp)

export const mergeMessages = (
  defaultMessages,
  baseMessages,
  channelMessages,
) => ({
  ...defaultMessages,
  ...baseMessages,
  ...channelMessages,
})

export default async function generateIntlMessagesFiles() {
  const langs = (await glob(path.resolve('base', 'lang', '*.json')))
    .map(filename => path.basename(filename, path.extname(filename)))
    .concat(['pt-br'])
  await mkdirp(path.resolve('channel', 'generated', 'lang'))

  const localeDataOutDir = path.join('public', 'generated', 'locale-data')
  await mkdirp(path.resolve(localeDataOutDir))

  return Promise.all(
    langs.map(async lang => {
      let baseMessages = {}
      let channelMessages = {}
      let defaultMessages = {}

      if (lang !== 'pt-br') {
        const baseFile = await readFile(
          path.resolve('base', 'lang', `${lang}.json`),
          'utf8',
        )
        baseMessages = JSON.parse(baseFile)
      }

      try {
        const channelFile = await readFile(
          path.resolve('channel', 'lang', `${lang}.json`),
          'utf8',
        )
        channelMessages = JSON.parse(channelFile)
      } catch (error) {
        // ...
      }

      try {
        const defaultFile = await readFile(
          path.resolve('channel', 'lang', 'default.json'),
          'utf8',
        )
        defaultMessages = JSON.parse(defaultFile)
      } catch (error) {
        // ...
      }

      const messages = mergeMessages(
        defaultMessages,
        baseMessages,
        channelMessages,
      )

      const localeDataOut = path.resolve(localeDataOutDir, `${lang}.js`)
      const ok = chalk.green.bold('OK')
      const locale = chalk.cyan.bold(lang.toUpperCase())
      // tslint:disable-next-line
      console.log(
        `${ok} ${locale} ${path.join(localeDataOutDir, `${lang}.json`)}`,
      )
      // tslint:disable-next-line
      console.log(
        `${ok} ${locale} ${path.join(
          'channel',
          'generated',
          'lang',
          `${lang}.json`,
        )}`,
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
