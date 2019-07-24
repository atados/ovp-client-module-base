import { Strategy as FacebookStrategy } from 'passport-facebook'
import { APP_URL } from '~/common/constants'
import { AUTH_FACEBOOK_ID, AUTH_FACEBOOK_SECRET } from '~/server/constants'
import convertToken from './convert-token'

export default function createFacebookStrategy() {
  return new FacebookStrategy(
    {
      clientID: AUTH_FACEBOOK_ID,
      clientSecret: AUTH_FACEBOOK_SECRET,
      callbackURL: `${APP_URL}/auth/facebook/return`,
      passReqToCallback: true,
    },
    async (_, accessToken, __, ___, done) => {
      const auth = await convertToken('facebook', accessToken)
      done(null, auth)
    },
  )
}
