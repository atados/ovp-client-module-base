import flat from 'flat'
import { readFileSync } from 'fs'
import * as IntlPolyfill from 'intl'
import * as path from 'path'
import { dev } from '~/common/constants'
import IntlDefaultMessages from '~/generated/lang/pt-br.json'
import IntlEnglishMessages from '~/generated/lang/en-us.json'
import IntlSpanishMessages from '~/generated/lang/es-ar.json'

Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

interface IntlMessages {
  [messageId: string]: string
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const messagesDataCache = new Map()

export default (locale: string) => {
  if (!messagesDataCache.has(locale) || dev) {
    let messages: IntlMessages = {}

    if (process.env.NODE_ENV === 'production') {
      if (locale.startsWith('en')) {
        messages = IntlEnglishMessages as any
      } else if (locale.startsWith('es')) {
        messages = IntlSpanishMessages as any
      } else {
        messages = IntlDefaultMessages as any
      }
    } else {
      // Get base lang messages
      if (locale !== 'pt-br') {
        Object.assign(
          messages,
          flat(
            JSON.parse(
              readFileSync(
                path.resolve('base', 'lang', `${locale}.json`),
                'utf8',
              ),
            ),
          ),
        )
      }

      try {
        Object.assign(
          messages,
          flat(
            JSON.parse(
              readFileSync(
                path.resolve('channel', 'lang', `${locale}.json`),
                'utf8',
              ),
            ),
          ),
        )
      } catch (error) {
        // ...
      }
    }

    messagesDataCache.set(locale, messages)
  }

  return messagesDataCache.get(locale)
}
