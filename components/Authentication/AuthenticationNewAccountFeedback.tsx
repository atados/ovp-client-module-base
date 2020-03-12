import React from 'react'
import { Asset, Page } from '~/common'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ReduxState } from '~/redux/root-reducer'
import Icon from '../Icon'
import Link from 'next/link'
import useModalManager from '~/hooks/use-modal-manager'

const m = defineMessages({
  title: {
    id: 'authentication.newAccountFeedback.title',
    defaultMessage: 'Parabéns pela nova conta',
  },
  subtitle: {
    id: 'authentication.newAccountFeedback.subtitle',
    defaultMessage: 'Sua conta foi criada com sucesso!',
  },
})

interface AuthenticationNewAccountFeedbackProps {
  readonly className?: string
}

const AuthenticationNewAccountFeedback: React.FC<AuthenticationNewAccountFeedbackProps> = ({
  className,
}) => {
  const modalManager = useModalManager()
  const viewer = useSelector((state: ReduxState) => state.user)
  const intl = useIntl()
  const handleCloseClick = () => {
    modalManager.close()
  }
  return (
    <div className={className}>
      <div className="max-w-sm mx-auto">
        {viewer ? (
          <div className="text-center">
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
            <h1 className="h2">{intl.formatMessage(m.title)}</h1>
            <p>{intl.formatMessage(m.subtitle)}</p>
            <div className="w-20 h-20 rounded-full shadow-lg bg-gray-200 my-6 mx-auto text-gray-400 text-center h1 py-4">
              <Icon name="person" />
            </div>
            <h5>{viewer.name}</h5>
            <span className="block mb-4 text-gray-700">
              <FormattedMessage
                id="authenticationNewAccountFeedback.nextStepDescription"
                defaultMessage="Continue para completar o seu perfil e receber indicações de vagas mais compatíveis com suas causas."
              />
            </span>
            <Link href={Page.Home}>
              <a
                onClick={handleCloseClick}
                className="btn bg-gray-200 text-gray-800 mr-4"
              >
                Pular <Icon name="close" />
              </a>
            </Link>
            <Link href={Page.ViewerSettings}>
              <a
                onClick={handleCloseClick}
                className="btn text-white bg-primary-500 hover:bg-primary-600"
              >
                Completar meu perfil <Icon name="arrow_forward" />
              </a>
            </Link>
          </div>
        ) : (
          <p>Erro interno</p>
        )}
      </div>
    </div>
  )
}

AuthenticationNewAccountFeedback.displayName =
  'AuthenticationNewAccountFeedback'

export default AuthenticationNewAccountFeedback
