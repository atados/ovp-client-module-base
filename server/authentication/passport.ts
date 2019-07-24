import { Request } from 'express'
import * as passport from 'passport'
import { getRandomColor } from '~/lib/color/manager'
import { fetchAPI } from '~/lib/fetch'
import { User } from '~/redux/ducks/user'
import createFacebookStrategy from '~/server/authentication/create-facebook-strategy'
import createGoogleStrategy from '~/server/authentication/create-google-strategy'
import createLocalStrategy from '~/server/authentication/create-local-strategy'
import { AuthenticationResponse } from './types'

function serializeUser(auth: AuthenticationResponse, done) {
  done(null, auth.access_token)
}

const RE_USER_NOT_NEEDED_URL = /^\/_next/
async function deserializeUser(req: Request, sessionToken, done) {
  // Prevent user fetching at dev-only routes
  if (RE_USER_NOT_NEEDED_URL.test(req.url)) {
    done(null, { token: sessionToken })
    return
  }

  try {
    const user = await fetchAPI<User>('/users/current-user/', {
      sessionToken,
    })

    user.profile = user.profile || { causes: [], skills: [] }
    user.profile.color = getRandomColor()

    done(null, {
      ...user,
      token: sessionToken,
    })
  } catch (error) {
    console.error('> Failed to deserialize', sessionToken)
    req.logout()
    if (
      error &&
      error.detail &&
      error.detail.startsWith('Invalid channel for user token')
    ) {
      done(null, null)
      return
    }

    if (/Signature has expired/.test(error.detail)) {
      done(null, null)
      return
    }

    console.error(error)
    done(error)
  }
}

passport.use(createFacebookStrategy())
passport.use(createGoogleStrategy())
passport.use(createLocalStrategy())

passport.serializeUser(serializeUser)
// @ts-ignore
passport.deserializeUser(deserializeUser)

export default passport
