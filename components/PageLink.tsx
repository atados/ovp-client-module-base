import React from 'react'
import Link, { LinkProps } from 'next/link'
import { Page, RequiredPagesMap, PageAs } from '../common'

interface PageLinkProps extends Omit<LinkProps, 'href'> {
  readonly href: keyof RequiredPagesMap
  readonly params?: { [paramName: string]: any }
}

const PageLink: React.FC<PageLinkProps> = ({
  href,
  children,
  params,
  ...props
}) => (
  <Link
    {...props}
    href={Page[href]}
    as={params ? PageAs[href](params) : undefined}
  >
    {children}
  </Link>
)

PageLink.displayName = 'PageLink'

export default PageLink
