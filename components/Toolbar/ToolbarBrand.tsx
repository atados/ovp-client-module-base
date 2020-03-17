import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { GlobalMessages, Config } from '~/common'
import { useIntl } from 'react-intl'

const Brand = styled.a`
  > img {
    height: 36px;
  }
`

interface ToolbarBrandProps {
  readonly className?: string
  readonly innerClassName?: string
  readonly brand?: string
  readonly href?: string
  readonly theme?: string
}

const ToolbarBrand: React.FC<ToolbarBrandProps> = React.forwardRef<
  HTMLAnchorElement,
  ToolbarBrandProps
>(
  (
    { className, href, brand, children, innerClassName, theme, ...props },
    ref,
  ) => {
    const intl = useIntl()

    return (
      <Brand
        {...props}
        ref={ref}
        href={href}
        className={cx(className, 'navbar-brand')}
      >
        {brand || Config.toolbar.brand ? (
          <img
            src={
              brand ||
              (theme === 'dark'
                ? Config.toolbar.brand
                : Config.assets.logoLight)
            }
            alt=""
            className={innerClassName}
          />
        ) : (
          intl.formatMessage(GlobalMessages.appName)
        )}
        {children}
      </Brand>
    )
  },
)

ToolbarBrand.displayName = 'ToolbarBrand'

export default ToolbarBrand
