import React from 'react'
import cx from 'classnames'
import Authentication from '~/components/Authentication'
import { AuthenticationProps } from './Authentication/Authentication'
import styled from 'styled-components'
import Icon from './Icon'

const IconCircle = styled.div`
  line-height: 1.95;
`

interface BeforeActionAuthProps extends AuthenticationProps {
  readonly className?: string
}

const BeforeActionAuth: React.FC<BeforeActionAuthProps> = ({
  className,
  ...props
}) => (
  <div className={cx('bg-gray-200 py-8', className)}>
    <div className="container px-2">
      <IconCircle className="mb-4 w-12 h-12 bg-gray-800 text-2xl rounded-full mx-auto block text-white text-center">
        <Icon name="vpn_key" />
      </IconCircle>
      <div className="bg-white shadow rounded-lg max-w-lg mx-auto py-8 animate-slideInUp">
        <Authentication {...props} />
      </div>
    </div>
  </div>
)

BeforeActionAuth.displayName = 'BeforeActionAuth'

export default BeforeActionAuth
