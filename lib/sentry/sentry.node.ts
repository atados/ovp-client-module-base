import * as Sentry from '@sentry/node'
import { Config } from '~/base/common'
import {
  NOW_GITHUB_COMMIT_SHA,
  NOW_GITHUB_COMMIT_DIRTY,
} from '~/common/constants'
export function setupErrorMonitoringOnServer() {
  // Only run Sentry on production
  if (Config.sentry) {
    Sentry.init({
      ...(Config.sentry as any),
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

export function reportNodeError(error: any) {
  console.error(error)
  Sentry.captureException(error)
}
