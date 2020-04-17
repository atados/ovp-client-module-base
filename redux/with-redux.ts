import { IncomingMessage } from 'http'
import withRedux from 'next-redux-wrapper'
import { MapStateToProps } from 'react-redux'
import { applyMiddleware, compose, createStore, Middleware } from 'redux'
import thunk from 'redux-thunk'
import { dev } from '~/common/constants'
import rootReducer, { RootState } from '~/redux/root-reducer'
import { resolveInitialReduxState } from '~/redux/initial-redux-state'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => (f: any) => any
  }
}

export interface CreateStoreContext {
  req?: IncomingMessage
}

export const configureStore = (
  baseState: Partial<RootState>,
  context?: CreateStoreContext,
) => {
  const initialState = resolveInitialReduxState(baseState, context)

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
