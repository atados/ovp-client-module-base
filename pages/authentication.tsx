import React from 'react'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import Authentication from '~/components/Authentication'
import { AuthenticationPageName } from '~/components/Authentication/Authentication'
import { defineMessages, useIntl } from 'react-intl'
import { NextPage } from 'next'
import { redirect } from '../lib/utils/next'

interface AuthenticationPageProps {
  readonly defaultPage?: AuthenticationPageName
  readonly nextPagePathname?: string
}

const m = defineMessages({
  title: {
    id: 'pages.authentication.title',
    defaultMessage: 'Entrar',
  },
})

const AuthenticationPage: NextPage<AuthenticationPageProps> = ({
  defaultPage,
  nextPagePathname,
}) => {
  const intl = useIntl()

  return (
    <Layout>
      <Meta title={intl.formatMessage(m.title)} />
      <div className="py-8 bg-muted">
        <div className="container px-2 max-w-lg">
          <div className="card rounded-lg p-5">
            <Authentication
              defaultPage={defaultPage}
              nextPagePathname={nextPagePathname}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

AuthenticationPage.displayName = 'AuthenticationPage'
AuthenticationPage.getInitialProps = async ctx => {
  const defaultPage = String(ctx.query.defaultPage)
  const next = ctx.query.next ? String(ctx.query.next) : '/'

  if (ctx.store.getState().user) {
    redirect(ctx, next)
    return {}
  }

  return {
    nextPagePathname: next,
    defaultPage:
      defaultPage === 'options' ||
      defaultPage === 'new-account' ||
      defaultPage === 'new-account-feedback' ||
      defaultPage === 'login'
        ? (defaultPage as AuthenticationPageName)
        : undefined,
  }
}

export default AuthenticationPage
