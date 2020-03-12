import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { Omit } from '~/types/global'
import { ReduxState } from '../root-reducer'
import { UserProfile } from './user'

export interface UserOverrides {
  name?: string
  phone?: string
  avatar?: number | null
  profile?: Omit<
    Partial<UserProfile>,
    'causes' | 'birthday_date' | 'skills' | 'address'
  > & {
    causes?: Array<{ id: number }>
    skills?: Array<{ id: number }>
    birthday_date?: string | null
    address?: { typed_address: string; typed_address2: string } | null
  }
}

export const updateUser = createAction<UserOverrides>(
  'USER_UPDATE',
  (overrides: UserOverrides, { getState }) => {
    const { user } = getState() as ReduxState

    if (!user) {
      return {}
    }

    return fetchAPI(`/users/current-user/`, {
      method: 'PATCH',
      body: overrides,
      sessionToken: user.token,
    })
  },
)

export interface PasswordUpdatePayload {
  currentPassword: string
  newPassword: string
}

export const updatePassword = createAction<PasswordUpdatePayload, boolean>(
  'USER_UPDATE',
  async (payload: PasswordUpdatePayload, { getState }) => {
    const { user } = getState() as ReduxState

    if (!user) {
      return true
    }

    await fetchAPI(`/users/current-user/`, {
      method: 'PATCH',
      body: {
        password: payload.newPassword,
        current_password: payload.currentPassword,
      },
      sessionToken: user.token,
    })

    return true
  },
)
