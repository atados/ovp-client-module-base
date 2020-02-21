import { IncomingMessage } from 'http'
import { RootState } from '~/redux/root-reducer'
import { Config } from '~/common'
import accepts from 'accepts'
import { NextIntl } from 'next'
import nextCookies from 'next-cookies'
import getMessages from '~/lib/intl/get-messages'

function createIntlObject(req: IncomingMessage): NextIntl {
  const accept = accepts(req)
  const reqLanguage = accept.language(['pt-br', 'en-us', 'es-ar'])
  const useDeviceLanguage = Config.intl.defaultTo === 'accept-language'
  const {
    locale = useDeviceLanguage ? reqLanguage : Config.intl.defaultLocale,
  } = nextCookies({ req })

  let messages = {}

  try {
    messages = getMessages(locale)
  } catch (error) {
    console.error(error)
  }

  return {
    locale,
    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    messages,
    initialNow: Date.now(),
  }
}
export const resolveInitialReduxState = (
  givenInitialState?: Partial<RootState>,
  ctx?: { req?: IncomingMessage },
): Partial<RootState> => {
  let initialState = givenInitialState
  if (!givenInitialState && ctx?.req) {
    const defaultGeo = Config.geolocation.default
    initialState = {
      geo: {
        country: defaultGeo.countryCode,
        region: defaultGeo.regionCode,
        lat: defaultGeo.latitude,
        lng: defaultGeo.longitude,
      },
      intl: createIntlObject(ctx.req),
    }
  }

  return initialState || {}
}
