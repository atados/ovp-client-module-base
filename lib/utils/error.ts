import * as Sentry from '@sentry/browser'
import { User } from '~/redux/ducks/user'
import {
  dev,
  NOW_GITHUB_COMMIT_SHA,
  NOW_GITHUB_COMMIT_DIRTY,
} from '~/common/constants'
import { Config } from '~/base/common'

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

export function setupErrorMonitoring() {
  // Only run Sentry on production
  if (Config.sentry) {
    Sentry.init({
      ...Config.sentry,
      environment: `${process.env.NODE_ENV || 'development'}${
        NOW_GITHUB_COMMIT_SHA
          ? `_now_${NOW_GITHUB_COMMIT_SHA}${
              NOW_GITHUB_COMMIT_DIRTY === 'true' ? '_dirty' : ''
            }`
          : ''
      }`,
    })
  }
}

export function reportError(error: any): void {
  if (dev) {
    console.error(`REPORTED: `, error)
    return
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
