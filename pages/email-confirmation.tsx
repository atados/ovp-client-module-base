import React, { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import { NextPage } from 'next'
import { NotFoundPageError } from '../lib/next/errors'
import useFetchAPIMutation from '../hooks/use-fetch-api-mutation'
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
  const confirmationMutation = useFetchAPIMutation<any>(() => ({
    method: 'POST',
    endpoint: '/users/verificate-email/',
  }))

  useEffect(() => {
    confirmationMutation.mutate({ token })
    setRendered(true)
  }, [token])

  const failed =
    confirmationMutation.error ||
    (confirmationMutation.data?.message &&
      RE_INVALID_MESSAGE.test(confirmationMutation.data.message))

  useEffect(() => {
    const error = confirmationMutation.error || confirmationMutation.data

    // Report response error only in production environment
    if (failed && error && !dev) {
      reportError(error)
    }
  }, [failed])

  return (
    <Layout>
      <div className="py-8 bg-gray-200">
        <div className="container px-2">
          <div className="shadow-lg bg-white rounded-lg max-w-lg p-5 mx-auto animate-slideInUp">
            {(confirmationMutation.loading || !rendered) && (
              <div className="py-8 text-center">
                <ActivityIndicator size={78} fill="#999" />
              </div>
            )}
            {confirmationMutation.error ? (
              <div className="text-center">
                <Icon
                  name="error"
                  className="text-red-500 text-6xl animate-slideInUp"
                />
                <h3>Ocorreu um erro</h3>
                <p className="text-gray-700 max-w-sm mx-auto">
                  Estamos verificando o que aconteceu. Pedimos desculpas pelo
                  ocorrido. Este erro foi reportado à nossa equipe e será
                  averiguado
                </p>
              </div>
            ) : (
              confirmationMutation.data && (
                <div className="text-center">
                  <Icon
                    name="check_circle_outline"
                    className="text-green-500 text-6xl animate-slideInUp"
                  />
                  <h3>Email confirmado com sucesso</h3>
                  <p className="text-gray-700">
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
