import React, { useReducer } from 'react'
import AuthenticationOptions from './AuthenticationOptions'
import AuthenticationEmailLogin from './AuthenticationEmailLogin'

type AuthenticationPageName = 'options' | 'new-account' | 'login'

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
  history: string[]
}

const authenticationReducer = (state: AuthenticationState, action: Action) => {
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

    const lastPage = history.pop()

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
  const [state, dispatch] = useReducer(authenticationReducer, {
    page: 'login',
    history: [],
  })

  if (state.page === 'login') {
    return (
      <AuthenticationEmailLogin className={className} dispatch={dispatch} />
    )
  }

  return <AuthenticationOptions className={className} dispatch={dispatch} />
}

Authentication.displayName = 'Authentication'

export default Authentication
export type AuthenticationAction = Action
