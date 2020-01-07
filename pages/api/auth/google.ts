import { send } from 'micro'
import microAuthGoogle from 'microauth-google-fork'
import { NextApiRequest, NextApiResponse } from 'next'
import { Page } from '~/base/common'
import convertAuthenticationToken from '~/base/lib/auth/convert-token'
import { APP_URL, dev } from '~/common/constants'
import {
  setupErrorMonitoringOnServer,
  reportNodeError,
} from '~/base/lib/sentry/sentry.node'

setupErrorMonitoringOnServer()

const { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } = process.env
function createGoogleAPIRoute() {
  if (!AUTH_GOOGLE_ID || !AUTH_GOOGLE_SECRET) {
    return (_: NextApiRequest, res: NextApiResponse) => {
      res.status(404)
      res.end('Google Authentication is not configured for this project.')
    }
  }

  const googleAuth = microAuthGoogle({
    clientId: AUTH_GOOGLE_ID,
    clientSecret: AUTH_GOOGLE_SECRET,
    callbackUrl: `${APP_URL}/api/google/callback`,
    path: '/api/google/auth',
    scopes: ['https://www.googleapis.com/auth/userinfo.email'],
  })

  return googleAuth(async (_, res, result) => {
    if (!result) {
      return send(res, 404, 'Not Found')
    }

    if ('error' in result) {
      // Error handler
      reportNodeError(result.error)
      return send(res, 403, 'Forbidden')
    }

    try {
      if (!result.accessToken) {
        throw new Error('Missing accessToken')
      }

      const payload = await convertAuthenticationToken(
        'google-oauth2',
        result.accessToken,
      )

      if (!payload) {
        res.statusCode = 302
        res.setHeader('Location', `${Page.Login}?error=invalid`)
        return
      }

      res.end(
        `
          <p>Loading...</p>
          <script>
            window.opener.postMessage(${JSON.stringify(
              JSON.stringify({
                method: 'google',
                sessionToken: payload.access_token,
              }),
            )}, "*")
          </script>
          `,
      )
    } catch (error) {
      reportNodeError(error)
      if (!dev) {
        res.statusCode = 500
        res.end('Internal server error. Please try again')
      }

      res.statusCode = 500
      res.end(JSON.stringify(error))
    }
  })
}

export default createGoogleAPIRoute()
