// tslint:disable:no-console

import prevGlob from 'glob'
import chalk from 'chalk'
import * as path from 'path'
import flat from 'flat'
import { promisify } from 'util'

const glob = promisify(prevGlob)

export default async function createLangFile() {
  const langs = new Set<string>()
  await glob(path.resolve('base', 'lang', '*.json')).then(filenames => {
    filenames.forEach(filename =>
      langs.add(path.basename(filename, path.extname(filename))),
    )
  })
  await glob(path.resolve('channel', 'lang', '*.json')).then(filenames => {
    filenames.forEach(filename =>
      langs.add(path.basename(filename, path.extname(filename))),
    )
  })

  return Promise.all(
    Array.from(langs).map(async lang => {
      const appMessages = {}
      const extractedMessagesFiles = await glob(
        path.resolve('channel', 'generated', '.messages', '**', '*.json'),
      )
      extractedMessagesFiles.forEach(messagesFile => {
        const json = require(messagesFile)

        json.forEach(message => {
          appMessages[message.id] = message.defaultMessage
        })
      })

      const definedMessages: object = flat(
        require(path.resolve('base', 'lang', `${lang}.json`)),
      )
      let channelMessages = {}

      try {
        channelMessages = flat(
          require(path.resolve('channel', 'lang', `${lang}.json`)),
        )
      } catch (error) {
        // ...
      } finally {
        Object.assign(definedMessages, flat(channelMessages))
      }

      const missingMessagesIds =
        lang === 'pt-br'
          ? []
          : Object.keys(appMessages).filter(
              appMessageId => !definedMessages[appMessageId],
            )
      const extraDefinedMessagesIds = Object.keys(definedMessages).filter(
        definedMessageId => !appMessages[definedMessageId],
      )

      console.log(
        `${chalk.bold(lang)} ${chalk.gray(
          `- ${missingMessagesIds.length} missing . ${extraDefinedMessagesIds.length} unused`,
        )}`,
      )
      if (extraDefinedMessagesIds.length) {
        console.log(`${chalk.cyan.bold('Unused defined messages:')}`)
        extraDefinedMessagesIds.forEach(extraDefinedMessageId => {
          console.log(chalk.cyan(`${extraDefinedMessageId}`))
        })
      }
      if (missingMessagesIds.length) {
        console.log(`\n${chalk.red.bold('Missing messages')}`)
        missingMessagesIds.forEach(missingDefinedMessageId => {
          console.log(
            chalk.red(
              `"${missingDefinedMessageId}": ${JSON.stringify(
                appMessages[missingDefinedMessageId],
              )}`,
            ),
          )
        })
      }
      console.log('\n')
    }),
  )
}
