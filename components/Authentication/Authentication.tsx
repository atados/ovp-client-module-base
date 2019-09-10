import React, { useReducer, Reducer } from 'react'
import AuthenticationOptions from './AuthenticationOptions'
import AuthenticationEmailLogin from './AuthenticationEmailLogin'
import AuthenticationEmailNewAccount from './AuthenticationEmailNewAccount'
import { useDispatch, useSelector } from 'react-redux'
import { login, User, loginWithSessionToken } from '~/base/redux/ducks/user'
import AuthenticationNewAccountFeedback from './AuthenticationNewAccountFeedback'
import { RootState } from '~/base/redux/root-reducer'
import useModalManager from '~/base/hooks/use-modal-manager'

type AuthenticationPageName =
  | 'options'
  | 'new-account'
  | 'new-account-feedback'
  | 'login'

export interface ActionBack {
  type: 'Back'
  payload: AuthenticationPageName
}

export interface ActionSetPage {
  type: 'SetPage'
  payload: AuthenticationPageName
}

type Action = ActionSetPage | ActionBack

interface AuthenticationState {
  page: AuthenticationPageName
  history: AuthenticationPageName[]
}

const authenticationReducer: Reducer<AuthenticationState, Action> = (
  state,
  action,
) => {
  if (action.type === 'SetPage') {
    return {
      page: action.payload,
      history: [...state.history, action.payload],
    }
  }

  if (action.type === 'Back') {
    const { history } = state

    if (!history.length) {
      return state
    }

    const lastPage = history.pop()!

    return {
      page: lastPage,
      history: [...history],
    }
  }

  return state
}

interface AuthenticationProps {
  readonly className?: string
}

const Authentication: React.FC<AuthenticationProps> = ({ className }) => {
  const modalManager = useModalManager()
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const [state, dispatch] = useReducer(authenticationReducer, {
    page: viewer ? 'new-account-feedback' : 'options',
    history: [],
  })
  const dispatchToRedux = useDispatch()
  const handleLogin = async (user: User) => {
    await dispatchToRedux(login(user))
    dispatch({
      type: 'SetPage',
      payload: 'new-account-feedback',
    })
  }
  const handleLoginBySessionToken = async (sessionToken: string) => {
    await dispatchToRedux(loginWithSessionToken(sessionToken))
    modalManager.close()
  }

  if (state.page === 'new-account-feedback') {
    return <AuthenticationNewAccountFeedback />
  }

  if (state.page === 'login') {
    return (
      <AuthenticationEmailLogin
        className={className}
        dispatch={dispatch}
        onLoginBySessionToken={handleLoginBySessionToken}
      />
    )
  }

  if (state.page === 'new-account') {
    return (
      <AuthenticationEmailNewAccount
        className={className}
        dispatch={dispatch}
        onLogin={handleLogin}
      />
    )
  }

  return <AuthenticationOptions className={className} dispatch={dispatch} />
}

Authentication.displayName = 'Authentication'

export default Authentication
export type AuthenticationAction = Action
