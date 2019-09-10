import cx from 'classnames'
import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { Page, PageAs, Asset } from '~/common'
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
}

const ToolbarBrand: React.FC<ToolbarBrandProps> = ({ className, brand }) => {
  const intl = useIntl()

  return (
    <Link href={Page.Home} as={PageAs.Home()}>
      <Brand href="/" className={cx(className, 'navbar-brand')}>
        {brand || Asset.ToolbarBrand ? (
          <img src={brand || Asset.ToolbarBrand} alt="" />
        ) : (
          intl.formatMessage(messages.appName)
        )}
      </Brand>
    </Link>
  )
}

ToolbarBrand.displayName = 'ToolbarBrand'

export default ToolbarBrand
