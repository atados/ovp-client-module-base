import { IncomingMessage } from 'http'
import { NextIntl } from 'next'
import nextCookies from 'next-cookies'
import withRedux from 'next-redux-wrapper'
import { MapStateToProps } from 'react-redux'
import { applyMiddleware, compose, createStore, Middleware } from 'redux'
import thunk from 'redux-thunk'
import { DEFAULT_LOCALE, dev } from '~/common/constants'
import getMessages from '~/lib/intl/get-messages'
import { User } from '~/redux/ducks/user'
import rootReducer, { RootState } from '~/redux/root-reducer'
import accepts from 'accepts'
import { Config } from '../common'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => (f: any) => any
  }
}

interface MyStoreCreatorOptions {
  req?: IncomingMessage & { user?: User } & {
    locale: string
    messages: { [messageId: string]: string }
  } & { startupData: any }
}

function createIntlObject(req: IncomingMessage): NextIntl {
  const accept = accepts(req)
  const reqLanguage = accept.language(['pt-br', 'en-us', 'es-ar'])
  const useDeviceLanguage = Config.intl.defaultTo === 'accept-language'
  const {
    locale = useDeviceLanguage ? reqLanguage : DEFAULT_LOCALE,
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

const configureStore = (
  baseState: Partial<RootState>,
  context: MyStoreCreatorOptions,
) => {
  let initialState = baseState
  if (context && context.req) {
    const defaultGeo = Config.geolocation.default
    initialState = {
      user: context.req.user || null,
      geo: {
        country: defaultGeo.countryCode,
        region: defaultGeo.regionCode,
        lat: defaultGeo.latitude,
        lng: defaultGeo.longitude,
      },
      intl: createIntlObject(context.req),
    }
  }

  const middleware: Middleware[] = [thunk]

  let enhancer

  if (dev) {
    // middleware.push(createLogger())

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let __REDUX_DEVTOOLS_EXTENSION__ = (f: any) => f
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
      __REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__()
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      __REDUX_DEVTOOLS_EXTENSION__,
    )
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  return createStore(rootReducer, initialState, enhancer)
}

export default (mapStateToProps?: MapStateToProps<any, any, any>) =>
  // @ts-ignore
  withRedux(configureStore, mapStateToProps)
