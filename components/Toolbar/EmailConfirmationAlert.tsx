import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import React, { useState, useEffect } from 'react'
import Alert from '~/components/Alert'
import styled from 'styled-components'
import { Config } from '~/common'
import moment from 'moment'
import { useRouter } from 'next/router'

const AlertWrapper = styled.div`
  z-index: 51 !important;
`

export interface EmailConfirmationAlertProps {
  readonly user: any
}

const EmailConfirmationAlert: React.FC<EmailConfirmationAlertProps> = ({
  user,
}) => {
  const router = useRouter()
  const [showEmailConfirmationAlert, setShowEmailConfirmationAlert] = useState(
    false,
  )
  const mutation = useFetchAPIMutation<{ success: boolean }>(email => ({
    endpoint: '/users/request-email-verification/',
    method: 'POST',
    body: { email },
  }))

  useEffect(() => {
    const isConfigPage = router.pathname === '/eu/configuracoes'

    if (
      user?.uuid &&
      !user.is_email_verified &&
      (Config.emailConfirmation.warning || isConfigPage)
    ) {
      const storedString: string | null = localStorage.getItem(
        'hiddenEmailConfirmation',
      )

      if (storedString && !isConfigPage) {
        const data = JSON.parse(storedString)
        if (
          user.uuid === data.userUuid &&
          moment().isAfter(data.expirationDate)
        ) {
          setShowEmailConfirmationAlert(true)
        }
      } else {
        setShowEmailConfirmationAlert(true)
      }
    }
  }, [user?.uuid])

  const handleClose = () => {
    if (user?.uuid) {
      const hiddenEmailConfirmation = {
        userUuid: user.uuid,
        expirationDate: moment()
          .add(1, 'week')
          .format(),
      }

      localStorage.setItem(
        'hiddenEmailConfirmation',
        JSON.stringify(hiddenEmailConfirmation),
      )
    }
  }

  const handleClick = () => {
    if (user?.email) {
      mutation.mutate(user.email)
      handleClose()
    }
  }

  if (!showEmailConfirmationAlert) {
    return null
  }

  return (
    <AlertWrapper className="fixed left-0 bottom-0 right-0">
      <Alert onClose={handleClose}>
        {mutation.data?.success ? (
          'O email foi enviado para você, verifique na sua caixa de entrada.'
        ) : (
          <div>
            <b className="mr-1">Seu email ainda não foi confirmado.</b> Perdeu o
            email de confirmação?{' '}
            {mutation.loading ? (
              'Enviando...'
            ) : (
              <>
                <button
                  role="send-confirmation-email"
                  className="inline-block mx-1 underline"
                  onClick={handleClick}
                >
                  Clique aqui
                </button>{' '}
                para gerar um novo
              </>
            )}
          </div>
        )}
      </Alert>
    </AlertWrapper>
  )
}

export default EmailConfirmationAlert
