import { Strategy as LocalStrategy } from 'passport-local'
import { fetchAPI } from '~/lib/fetch'
import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } from '~/server/constants'
import { AuthenticationResponse } from './types'

export default function createLocalStrategy() {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (_, username, password, callback) => {
      try {
        const authInstance = await fetchAPI<AuthenticationResponse>(
          '/auth/token/',
          {
            method: 'POST',
            body: {
              client_id: AUTH_CLIENT_ID,
              client_secret: AUTH_CLIENT_SECRET,
              grant_type: 'password',
              username,
              password,
            },
          },
        )

        callback(null, authInstance)
      } catch (error) {
        if (error.payload && error.payload.error === 'invalid_grant') {
          callback(null, null)
          return
        }

        callback(error)
      }
    },
  )
}
