import * as Sentry from '@sentry/browser'
import { User } from '~/redux/ducks/user'
import {
  dev,
  NOW_GITHUB_COMMIT_SHA,
  NOW_GITHUB_COMMIT_DIRTY,
} from '~/common/constants'
import { Config } from '~/common'

export function setSentryUser(user: User | null) {
  Sentry.configureScope(scope => {
    scope.setUser(
      user && {
        name: user.name,
        email: user.email,
        slug: user.slug,
        organizations: user.organizations
          ? user.organizations.map(o => ({
              name: o.name,
              slug: o.slug,
            }))
          : [],
      },
    )
  })
}

export const DEFAULT_SENTRY_DSN =
  'https://0707a5fa8f454705a21f8df93a4070e2@sentry.io/2067043'
export function setupErrorMonitoring() {
  // Only run Sentry on production
  if (Config.sentry) {
    Sentry.init({
      ...Config.sentry,
      environment: `${
        Config.sentry.dsn === DEFAULT_SENTRY_DSN
          ? `ovp-client-${Config.id}_`
          : ''
      }${process.env.NODE_ENV || 'development'}`,
    })
  }
}

export function reportError(error: any): void {
  if (dev) {
    console.error(`REPORTED: `, error)
  }

  Sentry.configureScope(scope => {
    if (error.payload) {
      scope.setExtra('response.statusCode', error.statusCode)
      scope.setExtra('response.payload', error.payload)
    }

    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      if (error && error.stack) {
        scope.setExtra('stack', error.stack)
      }

      Sentry.captureMessage(
        error && error.message ? error.message : error,
        Sentry.Severity.Error,
      )
    }
  })
}

export function catchErrorAndReport(error) {
  if (error instanceof Error) {
    reportError(error)
    throw error
  }

  return error
}
