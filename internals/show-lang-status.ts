// tslint:disable:no-console

import prevGlob from 'glob'
import chalk from 'chalk'
import * as path from 'path'
import flat from 'flat'
import { promisify } from 'util'

const glob = promisify(prevGlob)

export default async function createLangFile() {
  const langs = (await glob(path.resolve('channel', 'lang', '*.json'))).map(
    filename => path.basename(filename, path.extname(filename)),
  )

  return Promise.all(
    langs.map(async lang => {
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

      const definedMessages = require(path.resolve(
        'base',
        'lang',
        `${lang}.json`,
      ))
      let channelMessages = {}

      try {
        channelMessages = flat(
          require(path.resolve('channel', 'lang', `${lang}.json`)),
        )
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

      console.log(lang)
      extraDefinedMessagesIds.forEach(extraDefinedMessageId => {
        console.log(chalk.green(`${extraDefinedMessageId}`))
      })
      missingMessagesIds.forEach(missingDefinedMessageId => {
        console.log(
          chalk.red(
            `  ${missingDefinedMessageId}: ${JSON.stringify(
              appMessages[missingDefinedMessageId],
            )}`,
          ),
        )
      })
    }),
  )
}
