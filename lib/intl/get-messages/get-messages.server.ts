import flat from 'flat'
import { readFileSync } from 'fs'
import * as IntlPolyfill from 'intl'
import * as path from 'path'
import { dev } from '~/common/constants'

Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

interface IntlMessages {
  [messageId: string]: string
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const messagesDataCache = new Map()

if (process.env.NODE_ENV === 'production') {
  const storeAtCache = locale => payload => {
    messagesDataCache.set(locale, payload)
  }

  // @ts-ignore
  import('~/generated/lang/es-ar.json').then(storeAtCache('es-ar'))
  // @ts-ignore
  import('~/generated/lang/en-us.json').then(storeAtCache('en-us'))
  // @ts-ignore
  import('~/generated/lang/pt-br.json').then(storeAtCache('pt-br'))
}

export default (locale: string) => {
  if (!messagesDataCache.has(locale) || dev) {
    let messages: IntlMessages = {}

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

    messagesDataCache.set(locale, messages)
  }

  return messagesDataCache.get(locale)
}
