import { IncomingMessage } from 'http'
import withRedux, { MakeStoreOptions } from 'next-redux-wrapper'
import { MapStateToProps } from 'react-redux'
import { applyMiddleware, compose, createStore, Middleware } from 'redux'
import thunk from 'redux-thunk'
import { dev } from '~/common/constants'
import { User } from '~/redux/ducks/user'
import createLogger from '~/redux/logger'
import rootReducer, { RootState } from '~/redux/root-reducer'
import { ChannelRequest } from '~/server/channel/setup'
import { InjectedGeoProps } from '~/server/geo/setup'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => (f: any) => any
  }
}

interface MyStoreCreatorOptions extends MakeStoreOptions {
  req?: IncomingMessage & { user?: User } & ChannelRequest & {
      locale: string
      messages: { [messageId: string]: string }
    } & InjectedGeoProps
}

const configureStore = (
  baseState: Partial<RootState>,
  context: MyStoreCreatorOptions,
) => {
  let initialState = baseState
  if (context && context.req) {
    initialState = {
      user: context.req.user,
      geo: context.req.geo,
      startup: context.req.startupData,
      intl: {
        locale: context.req.locale,
        messages: context.req.messages,
      },
    }
  }

  const middleware: Middleware[] = [thunk]

  let enhancer

  if (dev) {
    middleware.push(createLogger())

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
