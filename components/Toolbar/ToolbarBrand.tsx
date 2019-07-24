import cx from 'classnames'
import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import useIntl from '~/hooks/use-intl'

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
}

const ToolbarBrand: React.FC<ToolbarBrandProps> = ({ className, brand }) => {
  const intl = useIntl()

  return (
    <Link href={resolvePage('/home')} as="/">
      <Brand href="/" className={cx(className, 'navbar-brand')}>
        {brand || channel.assets.toolbarBrand ? (
          <img src={brand || channel.assets.toolbarBrand} alt="" />
        ) : (
          intl.formatMessage(messages.appName)
        )}
      </Brand>
    </Link>
  )
}

ToolbarBrand.displayName = 'ToolbarBrand'

export default ToolbarBrand
