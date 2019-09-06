import React from 'react'
import { Asset, Page } from '~/base/common'
import { useIntl, defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '~/base/redux/root-reducer'
import Icon from '../Icon'
import Link from 'next/link'
import useModalManager from '~/base/hooks/use-modal-manager'

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

const AuthenticationNewAccountFeedback: React.FC<
  AuthenticationNewAccountFeedbackProps
> = ({ className }) => {
  const modalManager = useModalManager()
  const viewer = useSelector((state: RootState) => state.user)
  const intl = useIntl()
  const handleCloseClick = () => {
    modalManager.close()
  }
  return (
    <div className={className}>
      <div className="max-w-sm mx-auto">
        {viewer ? (
          <div className="ta-center">
            <img
              src={Asset.Logo}
              alt=""
              width="42"
              height="42"
              className="block mx-auto"
            />
            <h1 className="h2">{intl.formatMessage(m.title)}</h1>
            <p>{intl.formatMessage(m.subtitle)}</p>
            <div className="w-20 h-20 rounded-circle shadow-lg bg-gray-200 my-4 mx-auto tc-gray-400 ta-center h1 py-3">
              <Icon name="person" />
            </div>
            <h5>{viewer.name}</h5>
            <span className="block mb-3 tc-gray-700">
              Continue para completar o seu perfil e receber indicações de vagas
              mais compatíveis com suas causas.
            </span>
            <Link href={Page.Home}>
              <a
                onClick={handleCloseClick}
                className="btn bg-gray-200 tc-gray-800 mr-3"
              >
                Pular <Icon name="close" />
              </a>
            </Link>
            <Link href={Page.ViewerSettings}>
              <a onClick={handleCloseClick} className="btn btn-primary">
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
