import * as Sentry from '@sentry/node'
import { Config } from '~/common'
import { DEFAULT_SENTRY_DSN } from '~/lib/utils/error'
export function setupErrorMonitoringOnServer() {
  // Only run Sentry on production
  if (Config.sentry) {
    Sentry.init({
      ...(Config.sentry as any),
      environment: `${
        Config.sentry.dsn === DEFAULT_SENTRY_DSN
          ? `ovp-client-${Config.id}_`
          : ''
      }${process.env.NODE_ENV || 'development'}`,
    })
  }
}

export function reportNodeError(error: any) {
  console.error(error)
  Sentry.captureException(error)
}
