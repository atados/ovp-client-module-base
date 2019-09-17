import cx from 'classnames'
import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { Asset } from '~/common'
import { useIntl } from 'react-intl'

const Brand = styled.a`
  > img {
    height: 36px;
  }
`

const messages = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel',
  },
})

interface ToolbarBrandProps {
  readonly className?: string
  readonly brand?: string
  readonly href?: string
}

const ToolbarBrand: React.FC<ToolbarBrandProps> = ({
  className,
  href,
  brand,
}) => {
  const intl = useIntl()

  return (
    <Brand href={href} className={cx(className, 'navbar-brand')}>
      {brand || Asset.ToolbarBrand ? (
        <img src={brand || Asset.ToolbarBrand} alt="" />
      ) : (
        intl.formatMessage(messages.appName)
      )}
    </Brand>
  )
}

ToolbarBrand.displayName = 'ToolbarBrand'

export default ToolbarBrand
