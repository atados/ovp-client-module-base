import React from 'react'
import cx from 'classnames'
import { FormattedMessage } from 'react-intl'
import Mailbox from '~/components/SVG/Mailbox'
import Icon from '~/components/Icon'
import { useAPIFetcher } from '~/hooks/use-fetch'
import { useSelector } from 'react-redux'
import { RootState } from '~/redux/root-reducer'
import ActivityIndicator from '~/components/ActivityIndicator'
import { notifyErrorWithToast } from '~/components/Toasts/hooks'

interface ConfirmEmailBeforeProceedingProps {
  readonly className?: string
}

const ConfirmEmailBeforeProceeding: React.FC<ConfirmEmailBeforeProceedingProps> = ({
  className,
}) => {
  const viewer = useSelector((state: RootState) => state.user!)
  const confirmFetch = useAPIFetcher(() => {
    return {
      method: 'POST',
      endpoint: '/users/request-email-verification/',
      body: { email: viewer.email },
    }
  })
  notifyErrorWithToast(confirmFetch.error)

  const sent = Boolean(confirmFetch.data)
  return (
    <div className={cx(className)}>
      <div className="px-4 pb-8 pt-16">
        <h4 className="text-3xl font-medium text-center">
          <FormattedMessage
            id="confirmEmailBeforeProceeding.title"
            defaultMessage="Confirme seu email para continuar"
          />
        </h4>
        <p className="text-center text-gray-700 max-w-sm mx-auto">
          <FormattedMessage
            id="confirmEmailBeforeProceeding.description"
            defaultMessage="Enviamos um email para confirmar o seu acesso. Caso tenha perdido, clique abaixo que reenviaremos para você."
          />
        </p>
        <div className="text-center">
          <button
            type="button"
            className={`btn ${
              sent
                ? 'bg-gray-200 text-gray-700'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } font-medium py-3 px-4`}
            onClick={() => {
              if (!sent) {
                confirmFetch.fetch()
              }
            }}
            role="confirm-email"
          >
            {sent ? (
              <>Verifique na sua caixa de entrada</>
            ) : (
              <>
                Confirmar email
                {confirmFetch.loading ? (
                  <ActivityIndicator size={28} fill="#fff" className="ml-2" />
                ) : (
                  <Icon name="send" className="ml-2 text-primary-200" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
      <Mailbox width={300} height={200} className="mx-auto block" />
    </div>
  )
}

ConfirmEmailBeforeProceeding.displayName = 'ConfirmEmailBeforeProceeding'

export default ConfirmEmailBeforeProceeding
