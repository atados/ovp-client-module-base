import Link from 'next/link'
import React, { useEffect, Dispatch } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Page, Asset, PageAs } from '~/common'
import { useDispatch } from 'react-redux'
import { loginWithSessionToken } from '~/redux/ducks/user'
import Router from 'next/router'
import useModalManager from '~/hooks/use-modal-manager'
import { AuthenticationAction } from './Authentication'
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
}

const m = defineMessages({
  title: {
    id: 'authentication.title',
    defaultMessage: 'Bem vindo ao Channel',
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
}) => {
  const modalManager = useModalManager()
  const intl = useIntl()
  const dispatchToReduxStore = useDispatch()

  const handleRegisterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    dispatch({ type: 'SetPage', payload: 'new-account' })
  }

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data.split) {
        return
      }

      const [key, sessionToken] = event.data.split('=')

      if (key === 'sessionToken') {
        dispatchToReduxStore(loginWithSessionToken(sessionToken))
        if (Router.pathname === Page.Login) {
          Router.push(Page.Home, PageAs.Home())
        }

        if (modalManager.isModalOpen('Authentication')) {
          modalManager.close('Authentication')
        }
      }
    }

    window.addEventListener('message', handler, false)

    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div className={className}>
      <Header className="ta-center mb-4">
        <img
          src={Asset.Logo}
          alt=""
          width="42"
          height="42"
          className="block mx-auto"
        />
        <h1 className="h2 mb-3">{title || intl.formatMessage(m.title)}</h1>
        <p>{subtitle || intl.formatMessage(m.subtitle)}</p>
      </Header>
      <Body className="ta-center">
        <AuthenticationButtons dispatch={dispatch} />
      </Body>
      <div className="ta-center my-2">
        <a
          id="authentication-options-register"
          onClick={handleRegisterClick}
          href={PageAs.NewAccount()}
          className="tc-base block tw-normal py-2"
        >
          <FormattedMessage
            id="authenticationOptions.newAccount"
            defaultMessage="Ainda não possui uma conta?"
          />
        </a>
      </div>
      <Footer>
        <span className="block ta-center tc-muted-dark mt-3">
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
