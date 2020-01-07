import React from 'react'
import Link from 'next/link'

interface LinkIfProps {
  readonly className?: string
  readonly href?: string
  readonly as?: string
  readonly if?: any
}

const LinkIf: React.FC<LinkIfProps> = ({
  className,
  href,
  if: ifValue,
  as,
  children,
}) => {
  if (!ifValue || !href) {
    return children as React.ReactElement
  }

  return (
    <Link href={href} as={as}>
      <a className={className}>{children}</a>
    </Link>
  )
}

LinkIf.displayName = 'LinkIf'

export default LinkIf
