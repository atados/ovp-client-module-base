import cookie from 'js-cookie'
import deserializeUser from '~/base/lib/auth/deserialize-user'
import { Cause, Skill } from '~/common/channel'
import { editOrganization } from './organization-composer'
import { sendRating } from './ratings'
import { updateUser } from './user-update'
import { fetchAPI } from '~/base/lib/fetch/fetch.server'
import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } from '~/base/common/constants'
import { ThunkDispatch } from 'redux-thunk'

interface NewAccountPayload {
  name: string
  email: string
  password: string
  city: string
  subscribeToNewsletter: boolean
}

export const createNewUser = (
  newUser: NewAccountPayload,
): Omit<User, 'token'> & { token?: string } => {
  return fetchAPI('/users/', {
    method: 'POST',
    body: {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      profile: {
        address: {
          typed_address: newUser.city,
          city_state: newUser.city,
        },
      },
      is_subscribed_to_newsletter: Boolean(newUser.subscribeToNewsletter),
    },
  })
}

export const generateSessionTokenWithEmail = (
  email: string,
  password: string,
): Promise<string> => {
  return fetchAPI<string>('/auth/token/', {
    method: 'POST',
    body: {
      client_id: AUTH_CLIENT_ID,
      client_secret: AUTH_CLIENT_SECRET,
      grant_type: 'password',
      username: email,
      password,
    },
  }).then(session => session.access_token)
}

export const login = (user: User) => {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    cookie.set('sessionToken', user.token)
    dispatch({ type: 'LOGIN', payload: user })
  }
}

export const loginWithSessionToken = (sessionToken: string) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const user = await deserializeUser(sessionToken)
      user.token = sessionToken
      dispatch(login(user))
    } catch (error) {
      if (error.payload && error.payload.detail) {
        cookie.remove('sessionToken')
        return
      }

      throw error
    }
  }
}

export const logout = () => {
  cookie.remove('sessionToken')

  return {
    type: 'LOGOUT',
  }
}

export interface User {
  uuid: string
  name: string
  slug: string
  token: string
  profile: UserProfile
  phone?: string
  chat_enabled?: boolean
  rating_requests_project_count: number
  rating_requests_projects_with_unrated_users: number
  organizations: UserOrganization[]
  avatar?: {
    image_small_url: string
    image_url: string
  }
}

export interface UserOrganization {
  id: number
  slug: string
  name: string
  description: string
  chat_enabled: boolean
  image?: {
    image_small_url: string
    image_url: string
  }
}

export interface UserProfile {
  color: string
  birthday_date: string
  gender: string
  causes?: Cause[]
  skills?: Skill[]
  about?: string
  address: {
    typed_address: string
  } | null
}

export type UserState = User | null

export default (user: User | null = null, action): UserState => {
  if (action.type === 'LOGOUT') {
    return null
  }

  if (action.type === 'LOGIN') {
    return action.payload
  }

  if (user && action.type === sendRating.type && !action.pending) {
    return {
      ...user,
      rating_requests_project_count:
        action.meta.type === 'project'
          ? user.rating_requests_project_count - 1
          : user.rating_requests_project_count,
      rating_requests_projects_with_unrated_users:
        action.meta.type === 'user' && action.meta.first
          ? user.rating_requests_project_count - 1
          : user.rating_requests_project_count,
    }
  }

  if (user && action.payload && action.type === editOrganization.type) {
    return {
      ...user,
      organizations: user.organizations.map(organization => {
        if (organization.id === action.payload.id) {
          return {
            ...organization,
            ...action.payload,
          }
        }

        return organization
      }),
    }
  }

  if (user && action.type === updateUser.type) {
    return {
      ...user,
      ...action.payload,
    }
  }

  return user
}
