import React, { useCallback, useRef, Dispatch, useEffect } from 'react'
import styled from 'styled-components'
import { PopupCenter } from '~/base/lib/utils/dom'
import Icon from '../Icon'
import { AuthenticationAction } from './Authentication'
import { useIntl, defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '~/base/redux/root-reducer'

const AuthButton = styled.button`
  padding: 12px 10px 12px 38px;
  height: auto;
  white-space: nowrap;
  font-size: 18px;

  &.auth-email {
    background: #fff;
    border-color: #ccc;

    &:hover {
      background: #f6f7f8;
    }
  }

  &.auth-facebook {
    background: #3b5998;
    color: #fff !important;

    &:hover {
      background: #304c86;
    }
  }

  &.auth-google {
    background: #4285f4;
    color: #fff !important;

    &:hover {
      background: #2168dc;
    }
  }
`

const AuthIcon = styled.span`
  text-align: center;
  float: left;
  display: block;
  margin: -5px 0 -5px -30px;
  margin-right: 10px;
  width: 30px;
  height: 30px;

  .auth-google & {
    background: #fff;
    padding: 5px;
    background: #fff;
    border-radius: 3px;
  }

  > .icon {
    font-size: 24px;
    line-height: 1.3;
  }
`

const m = defineMessages({
  email: {
    id: 'authenticationButtons.email',
    defaultMessage: 'Continuar com Email',
  },
  facebook: {
    id: 'authenticationButtons.facebook',
    defaultMessage: 'Continuar com Facebook',
  },
  google: {
    id: 'authenticationButtons.google',
    defaultMessage: 'Continuar com Google',
  },
})

interface AuthenticationButtonsProps {
  readonly className?: string
  readonly dispatch: Dispatch<AuthenticationAction>
}

const AuthenticationButtons: React.FC<AuthenticationButtonsProps> = ({
  className,
  dispatch,
}) => {
  const intl = useIntl()
  const popupRef = useRef<Window | null>(null)
  const viewer = useSelector((state: RootState) => state.user)
  const handleFacebookAuth = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (popupRef.current) {
        popupRef.current.close()
      }

      popupRef.current = PopupCenter('/api/facebook/auth', 'Facebook', 600, 500)
    },
    [],
  )
  const handleGoogleAuth = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (popupRef.current) {
        popupRef.current.close()
      }

      popupRef.current = PopupCenter('/api/google/auth', 'Google', 400, 500)
    },
    [],
  )
  const handleEmailAuth = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      dispatch({ type: 'SetPage', payload: 'login' })
    },
    [],
  )
  useEffect(() => {
    if (viewer && popupRef.current) {
      popupRef.current.close()
    }
  }, [viewer])
  return (
    <div className={className}>
      <AuthButton
        type="button"
        className="btn btn--block btn--size-4 mb-2 text-left auth-email truncate"
        onClick={handleEmailAuth}
      >
        <AuthIcon>
          <Icon name="mail_outline" />
        </AuthIcon>
        {intl.formatMessage(m.email)}
      </AuthButton>
      <AuthButton
        type="button"
        className="btn btn--block btn--size-4 mb-2 text-left auth-facebook truncate"
        onClick={handleFacebookAuth}
      >
        <AuthIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 216 216"
            color="#FFFFFF"
            width="28"
            height="28"
          >
            <path
              fill="#FFFFFF"
              d="
        M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
        11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
        11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
        15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
        11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
            />
          </svg>
        </AuthIcon>
        {intl.formatMessage(m.facebook)}
      </AuthButton>
      <AuthButton
        type="button"
        className="btn btn--block btn--size-4 text-left auth-google truncate"
        onClick={handleGoogleAuth}
      >
        <AuthIcon>
          <svg
            viewBox="0 0 512 512"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <path
                d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z"
                fill="#4285f4"
              />
              <path
                d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z"
                fill="#34a853"
              />
              <path
                d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z"
                fill="#fbbc05"
              />
              <path
                d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z"
                fill="#ea4335"
              />
              <path d="M20 20h472v472H20V20z" />
            </g>
          </svg>
        </AuthIcon>
        {intl.formatMessage(m.google)}
      </AuthButton>
    </div>
  )
}

AuthenticationButtons.displayName = 'AuthenticationButtons'

export default AuthenticationButtons
