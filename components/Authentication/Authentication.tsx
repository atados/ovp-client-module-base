import * as React from 'react'
import AuthenticationLogin from '~/components/Authentication/AuthenticationLogin'
import AuthenticationRegister from '~/components/Authentication/AuthenticationRegister'
import RouterSwitch from '~/components/RouterSwitch'
import * as RouterSwitchOptions from '~/components/RouterSwitch/RouterSwitch'
import AuthenticationRecover from './AuthenticationRecover'

interface AuthenticationProps {
  readonly location?: RouterSwitchOptions.Location
  readonly defaultPath?: string
  readonly successRedirect?: string
  readonly failedRedirect?: string
  readonly errorCode?: string
  readonly registerError?: string
  readonly loginError?: string
  readonly className?: string
  readonly headerDisabled?: boolean
  readonly disableBackButton?: boolean
  readonly onLocationChange?: RouterSwitchOptions.OnLocationChangeCallback
}

const Authentication: React.SFC<AuthenticationProps> = ({
  className,
  defaultPath,
  registerError,
  loginError,
  successRedirect,
  failedRedirect,
  onLocationChange,
  location,
  disableBackButton,
  headerDisabled,
  errorCode,
}) => (
  <RouterSwitch
    disableBackButton={disableBackButton}
    location={location}
    onLocationChange={onLocationChange}
    className={className}
    defaultPath={defaultPath}
    transition="fade-up"
    routes={[
      {
        path: '/register',
        component: AuthenticationRegister,
        props: {
          error: registerError,
          successRedirect,
          failedRedirect,
          errorCode,
          headerDisabled,
        },
      },
      {
        path: '/recover',
        component: AuthenticationRecover as React.ComponentType,
      },
      {
        path: '/login',
        component: AuthenticationLogin,
        props: {
          error: loginError,
          successRedirect,
          failedRedirect,
          errorCode,
          headerDisabled,
        },
      },
    ]}
  />
)

Authentication.displayName = 'Authentication'
Authentication.defaultProps = {
  defaultPath: '/login',
  className: undefined,
}

export default Authentication
