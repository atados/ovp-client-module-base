import React from 'react'
import { Config } from '~/common'
import { FormattedMessage } from 'react-intl'
import cx from 'classnames'

interface FAQSupportProps {
  readonly className?: string
}

const FAQSupport: React.FC<FAQSupportProps> = ({ className }) => {
  if (!Config.supportURL) {
    return null
  }

  return (
    <div className={cx('bg-gray-100 p-5 rounded-lg text-center', className)}>
      <p className="text-gray-700">
        <FormattedMessage
          id="pages.faqQuestion.needHelp"
          defaultMessage="Ainda precisa de ajuda?"
        />
      </p>
      <a
        href={Config.supportURL}
        target="__blank"
        className="btn bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-800"
      >
        <FormattedMessage
          id="pages.faqQuestion.contactSupport"
          defaultMessage="Entre em contato com nosso suporte"
        />
      </a>
    </div>
  )
}

FAQSupport.displayName = 'FAQSupport'

export default FAQSupport
