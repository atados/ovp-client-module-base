import * as Sentry from '@sentry/browser'
import { dev } from '~/common/constants'

export function reportError(error: any): void {
  if (dev) {
    console.error(error)
    return
  }

  Sentry.configureScope(scope => {
    if (error.payload) {
      scope.setExtra('response.status', error.status)
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
