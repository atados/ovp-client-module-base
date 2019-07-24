import * as accepts from 'accepts'
import { Express, Request } from 'express'
import flat from 'flat'
import { readFileSync } from 'fs'
import * as glob from 'glob'
import * as IntlPolyfill from 'intl'
import { basename, resolve } from 'path'
import { dev } from '~/common/constants'

Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

interface IntlMessages {
  [messageId: string]: string
}

// Get the supported languages by looking for translations in the `lang/` dir.

const supportedLanguages = glob
  .sync(resolve('base', 'lang', '*.json'))
  .map(f => basename(f, '.json'))

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = (locale: string) => {
  const lang = locale.split('-')[0]

  if (!localeDataCache.has(lang)) {
    // @ts-ignore
    const localeDataFile = __non_webpack_require__.resolve(
      `react-intl/locale-data/${lang}`,
    )

    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }

  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. This will load every yaml file under `src/lang/{locale}` and
// `lang/.defaults`.
// In production it will only load a locale's messages once.
const messagesCache = new Map<string, IntlMessages>()
const getMessages = (locale: string): IntlMessages => {
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale)!
  }

  const messages: IntlMessages = {}
  Object.assign(
    messages,
    flat(
      JSON.parse(
        readFileSync(resolve('base', 'lang', `${locale}.json`), 'utf8'),
      ),
    ),
  )

  try {
    Object.assign(
      messages,
      flat(
        JSON.parse(
          readFileSync(resolve('channel', 'lang', `${locale}.json`), 'utf8'),
        ),
      ),
    )
  } catch (error) {
    // ...
  }

  if (!dev) {
    messagesCache.set(locale, messages)
  }

  return messages
}

export interface IntlRequest extends Request {
  locale: string
  localeDataScript
  messages: IntlMessages
}

export default (server: Express) => {
  server.use((req: IntlRequest, _, next) => {
    const accept = accepts(req)
    const acceptLanguage = accept.language(supportedLanguages)
    const locale: string =
      typeof acceptLanguage === 'string' ? acceptLanguage : 'pt-br'

    req.locale = locale
    req.localeDataScript = getLocaleDataScript(locale)
    req.messages = getMessages(locale)

    next()
  })
}
