import Link from 'next/link'
import React, { useEffect, Dispatch } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Page, Asset, PageAs, GlobalMessages } from '~/common'
import {
  AuthenticationAction,
  AuthenticateBySessionTokenFn,
} from './Authentication'
import AuthenticationButtons from './AuthenticationButtons'

const Body = styled.div`
  max-width: 20rem;
  margin: 0 auto;

  &.auth-email {
    max-width: 21.25rem;
  }
`

const Header = styled.header`
  max-width: 360px;
  margin: 0 auto;
`

const Footer = styled.footer`
  max-width: 380px;
  margin: 0 auto;
`

interface AuthenticationOptionsProps {
  readonly className?: string
  readonly title?: React.ReactNode
  readonly subtitle?: React.ReactNode
  readonly dispatch: Dispatch<AuthenticationAction>
  readonly onLoginBySessionToken: AuthenticateBySessionTokenFn
}

const m = defineMessages({
  title: {
    id: 'authentication.title',
    defaultMessage: 'Bem vindo ao {appName}',
  },
  subtitle: {
    id: 'authentication.description',
    defaultMessage:
      'Faça login para receber recomendações personalizadas de voluntariado, se inscrever em ações e fazer parte da comunidade',
  },
  terms: {
    id: 'authenticationOptions.terms',
    defaultMessage:
      'Ao cadastrar-se você assume que leu e que concorda com nossos {privacy} e {services}',
  },

  privacyTerms: {
    id: 'authenticationOptions.privacy',
    defaultMessage: 'Termos de privacidade',
  },

  serviceTerms: {
    id: 'authenticationOptions.service',
    defaultMessage: 'Termos de serviço',
  },
})

const AuthenticationOptions: React.FC<AuthenticationOptionsProps> = ({
  className,
  dispatch,
  title,
  subtitle,
  onLoginBySessionToken,
}) => {
  const intl = useIntl()

  const handleRegisterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    dispatch({ type: 'SetPage', payload: 'new-account' })
  }

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data.split) {
        return
      }

      try {
        const { method, sessionToken } = JSON.parse(event.data)

        if (sessionToken) {
          onLoginBySessionToken(sessionToken, method)
        }
      } catch (error) {
        console.error(error)
      }
    }

    window.addEventListener('message', handler, false)

    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div className={className}>
      <Header className="text-center mb-6">
        {Asset.logoLight ? (
          <img
            src={Asset.logoLight}
            alt=""
            height="42"
            className="block mx-auto mb-3"
            style={{ maxWidth: '200px' }}
          />
        ) : (
          <div className="mb-4"></div>
        )}
        <h1 className="h2 mb-4">
          {title ||
            intl.formatMessage(m.title, {
              appName: intl.formatMessage(GlobalMessages.appName),
            })}
        </h1>
        <p>{subtitle || intl.formatMessage(m.subtitle)}</p>
      </Header>
      <Body className="text-center">
        <AuthenticationButtons dispatch={dispatch} />
      </Body>
      <div className="text-center my-2">
        <a
          id="authentication-options-register"
          onClick={handleRegisterClick}
          href={PageAs.NewAccount()}
          className="text-gray-800 block font-normal py-3"
        >
          <FormattedMessage
            id="authenticationOptions.newAccount"
            defaultMessage="Ainda não possui uma conta?"
          />
        </a>
      </div>
      <Footer>
        <span className="block text-center text-gray-700 mt-4">
          {intl.formatMessage(m.terms, {
            privacy: (
              <Link key="privacy" href={Page.PrivacyTerms}>
                <a>{intl.formatMessage(m.privacyTerms)}</a>
              </Link>
            ),
            services: (
              <Link key="usage" href={Page.UsageTerms}>
                <a>{intl.formatMessage(m.serviceTerms)}</a>
              </Link>
            ),
          })}
        </span>
      </Footer>
    </div>
  )
}

AuthenticationOptions.displayName = 'Authentication'

export default AuthenticationOptions
