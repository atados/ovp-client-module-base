import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { APP_URL } from '~/common/constants'
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } from '~/server/constants'
import convertToken from './convert-token'

export default function createGoogleStrategy() {
  return new GoogleStrategy(
    {
      clientID: AUTH_GOOGLE_ID,
      clientSecret: AUTH_GOOGLE_SECRET,
      callbackURL: `${APP_URL}/auth/google/return`,
      passReqToCallback: true,
    },
    async (_, accessToken, __, ___, done) => {
      const auth = await convertToken('google-oauth2', accessToken)
      done(null, auth)
    },
  )
}
