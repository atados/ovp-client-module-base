import React, { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import { NextPage } from 'next'
import { NotFoundPageError } from '../lib/next/errors'
import useTriggerableFetchApi from '../hooks/use-trigglerable-fetch-api'
import ActivityIndicator from '~/components/ActivityIndicator'
import Icon from '../components/Icon'
import { reportError } from '../lib/utils/error'
import { dev } from '../common/constants'

interface EmailConfirmationPageProps {
  readonly token: string
}

const RE_INVALID_MESSAGE = /invalid/gi
const EmailConfirmationPage: NextPage<EmailConfirmationPageProps> = ({
  token,
}) => {
  const [rendered, setRendered] = useState(false)
  const confirmationQuery = useTriggerableFetchApi<any>(
    '/users/verificate-email/',
    {
      method: 'POST',
    },
  )
  useEffect(() => {
    confirmationQuery.trigger({ token })
    setRendered(true)
  }, [token])

  const failed =
    confirmationQuery.error ||
    (confirmationQuery.data &&
      confirmationQuery.data.message &&
      RE_INVALID_MESSAGE.test(confirmationQuery.data.message))

  useEffect(() => {
    const error = confirmationQuery.error || confirmationQuery.data

    // Report response error only in production environment
    if (failed && error && !dev) {
      reportError(error)
    }
  }, [failed])

  return (
    <Layout>
      <div className="py-5 bg-gray-200">
        <div className="container">
          <div className="shadow-lg bg-white rounded-lg max-w-lg p-5 mx-auto animate-slideInUp">
            {(confirmationQuery.loading || !rendered) && (
              <div className="py-5 ta-center">
                <ActivityIndicator size={78} fill="#999" />
              </div>
            )}
            {false ? (
              <div className="ta-center">
                <Icon
                  name="error"
                  className="tc-red-500 text-6xl animate-slideInUp"
                />
                <h3>Ocorreu um erro</h3>
                <p className="tc-gray-700 max-w-sm mx-auto">
                  Estamos verificando o que aconteceu. Pedimos desculpas pelo
                  ocorrido. Este erro foi reportado à nossa equipe e será
                  averiguado
                </p>
              </div>
            ) : (
              confirmationQuery.data && (
                <div className="ta-center">
                  <Icon
                    name="check_circle_outline"
                    className="tc-green-500 text-6xl animate-slideInUp"
                  />
                  <h3>Email confirmado com sucesso</h3>
                  <p className="tc-gray-700">
                    O email é o nosso meio de contato com você. Fique atento às
                    nossas mensagens.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

EmailConfirmationPage.displayName = 'EmailConfirmationPage'
EmailConfirmationPage.getInitialProps = async ctx => {
  if (!ctx.query.token) {
    throw new NotFoundPageError()
  }

  return {
    token: String(ctx.query.token),
  }
}

export default EmailConfirmationPage
