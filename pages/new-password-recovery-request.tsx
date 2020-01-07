import React from 'react'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import { useIntl, defineMessages } from 'react-intl'
import AuthenticationRecover from '~/components/Authentication/AuthenticationRecover'

const m = defineMessages({
  title: {
    id: 'pages.newPasswordRecoveryRequest.title',
    defaultMessage: 'Esqueci minha senha',
  },
})

interface NewPasswordRecoveryRequestProps {
  readonly className?: string
}

const NewPasswordRecoveryRequest: React.FC<NewPasswordRecoveryRequestProps> = () => {
  const intl = useIntl()

  return (
    <Layout>
      <Meta title={intl.formatMessage(m.title)} />
      <div className="py-8 bg-muted">
        <div className="container container--sm">
          <div className="card rounded-lg p-5">
            <AuthenticationRecover />
          </div>
        </div>
      </div>
    </Layout>
  )
}

NewPasswordRecoveryRequest.displayName = 'NewPasswordRecoveryRequest'

export default NewPasswordRecoveryRequest
