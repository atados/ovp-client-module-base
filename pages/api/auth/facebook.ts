import { send } from 'micro'
import microAuthFacebook from 'microauth-facebook'
import { NextApiRequest, NextApiResponse } from 'next'
import { Page } from '~/base/common'
import convertAuthenticationToken from '~/base/lib/auth/convert-token'
import { APP_URL, dev } from '~/common/constants'
import {
  setupErrorMonitoringOnServer,
  reportNodeError,
} from '~/base/lib/sentry/sentry.node'

setupErrorMonitoringOnServer()
type AuthResponse =
  | { err: Error; result: undefined }
  | {
      err: undefined
      result: {
        provider: 'facebook'
        accessToken: string
        info: {
          name: string
          email: string
          id: string
        }
      }
    }

const { AUTH_FACEBOOK_ID, AUTH_FACEBOOK_SECRET } = process.env
function createFacebookAPIRoute() {
  if (!AUTH_FACEBOOK_ID || !AUTH_FACEBOOK_SECRET) {
    return (_: NextApiRequest, res: NextApiResponse) => {
      res.status(404)
      res.end('Facebook Authentication is not configured for this project.')
    }
  }

  const facebookAuth = microAuthFacebook({
    appId: AUTH_FACEBOOK_ID,
    appSecret: AUTH_FACEBOOK_SECRET,
    callbackUrl: `${APP_URL}/api/facebook/callback`,
    path: '/api/facebook/auth',
  })

  return facebookAuth(
    async (_: NextApiRequest, res: NextApiResponse, auth: AuthResponse) => {
      if (!auth) {
        return send(res, 404, 'Not Found')
      }

      if (auth.err) {
        // Error handler
        reportNodeError(auth.err)
        return send(res, 403, 'Forbidden')
      }

      try {
        const payload = await convertAuthenticationToken(
          'facebook',
          auth.result.accessToken,
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
                method: 'facebook',
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
    },
  )
}

export default createFacebookAPIRoute()
