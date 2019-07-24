import * as React from 'react'
import Footer, { FooterProps } from '~/components//Footer/Footer'
import Toolbar, { ToolbarProps } from '~/components/Toolbar/Toolbar'

export interface LayoutProps {
  readonly className?: string
  readonly toolbarProps?: Partial<ToolbarProps>
  readonly footerProps?: FooterProps
  readonly disableFooter?: boolean
  readonly children?: React.ReactNode
}

const Layout: React.SFC<LayoutProps> = ({
  children,
  toolbarProps,
  footerProps,
  disableFooter,
  className,
}) => (
  <div className={className}>
    <Toolbar {...toolbarProps} />
    {children}
    {!disableFooter && <Footer {...footerProps} />}
  </div>
)

Layout.displayName = 'Layout'

export default React.memo(Layout)
