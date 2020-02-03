import React from 'react'
import { useIntl } from 'react-intl'
import { GlobalMessages } from '~/common'

export default () => {
  const intl = useIntl()

  return (
    <div className="bg-primary-500">
      <div className="container py-8">
        <h1 className="text-white">
          {intl.formatMessage(GlobalMessages.appName)}
        </h1>
        <p className="text-white-alpha-80 text-xl">
          {intl.formatMessage(GlobalMessages.appDescription)}
        </p>
      </div>
    </div>
  )
}
