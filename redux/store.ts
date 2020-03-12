import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer, { ReduxState } from '~/redux/root-reducer'

console.warn('TODO: Initial state should be equal to states')
const initialState: Partial<ReduxState> = {
  startup: {
    causes: [],
    skills: [],
    stats: {},
  },
  geo: {
    region: '',
  },
}

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(reduxThunk)),
  )
}
