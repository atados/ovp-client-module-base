import Link from 'next/link'
import React, { useEffect, Dispatch } from 'react'
import { defineMessages } from 'react-intl'
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
})

const AuthenticationOptions: React.FC<AuthenticationOptionsProps> = ({
  className,
  dispatch,
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
        <h1 className="h2 mb-3">{intl.formatMessage(m.title)}</h1>
        <p>{intl.formatMessage(m.subtitle)}</p>
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
          Ainda não possui uma conta?
        </a>
      </div>
      <Footer>
        <span className="block ta-center tc-muted-dark mt-3">
          Ao cadastrar-se você assume que leu e que concorda com nossos{' '}
          <Link href={Page.PrivacyTerms}>
            <a>Termos de privacidade</a>
          </Link>{' '}
          e{' '}
          <Link href={Page.UsageTerms}>
            <a>Termos de serviço</a>
          </Link>
          .
        </span>
      </Footer>
    </div>
  )
}

AuthenticationOptions.displayName = 'Authentication'

export default AuthenticationOptions
