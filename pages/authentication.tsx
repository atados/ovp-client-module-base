import React from 'react'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import Authentication from '~/components/Authentication'
import { AuthenticationPageName } from '~/components/Authentication/Authentication'
import { defineMessages, useIntl } from 'react-intl'
import { NextPage } from 'next'

interface AuthenticationPageProps {
  readonly defaultPage?: AuthenticationPageName
}

const m = defineMessages({
  title: {
    id: 'pages.authentication.title',
    defaultMessage: 'Entrar',
  },
})

const AuthenticationPage: NextPage<AuthenticationPageProps> = ({
  defaultPage,
}) => {
  const intl = useIntl()

  return (
    <Layout>
      <Meta title={intl.formatMessage(m.title)} />
      <div className="py-5 bg-muted">
        <div className="container container--sm">
          <div className="card rounded-lg p-5">
            <Authentication defaultPage={defaultPage} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

AuthenticationPage.displayName = 'AuthenticationPage'
AuthenticationPage.getInitialProps = async ctx => {
  const defaultPage = String(ctx.query.defaultPage)
  return {
    defaultPage:
      defaultPage === 'options' ||
      defaultPage === 'new-account' ||
      defaultPage === 'new-account-feedback' ||
      defaultPage === 'login'
        ? defaultPage
        : undefined,
  }
}

export default AuthenticationPage
