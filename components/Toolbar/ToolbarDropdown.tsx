import React, { useState } from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Link from 'next/link'
import { Color } from '~/common'

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  width: 400px;
  height: 300px;
  margin-top: -5px;
  right: 0;
  left: auto;
  border-top-right-radius: 0;
`

const Anchor = styled.a`
  z-index: 1000000;
  border-radius: 6px 6px 0 0;
  position: relative;

  &.active {
    background: #fff;
    color: ${Color.primary[500]} !important;
    font-weight: 500;
  }
`

interface ToolbarDropdownProps {
  readonly title: React.ReactNode
  readonly href: string
  readonly linkAs?: string
  readonly className?: string
  readonly anchorClassName?: string
  readonly menuClassName?: string
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  className,
  anchorClassName,
  menuClassName,
  title,
  href,
  linkAs,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const handleMouseLeave = () => open && setOpen(false)
  const handleMouseEnter = () => !open && setOpen(true)

  return (
    <Dropdown
      className={className}
      open={open}
      onOpenStateChange={setOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} as={linkAs} passHref>
        <Anchor
          className={`nav-link ${anchorClassName || ''} ${
            open ? 'active' : ''
          }`}
        >
          {title}
        </Anchor>
      </Link>
      <Menu className={menuClassName}>{children}</Menu>
    </Dropdown>
  )
}

ToolbarDropdown.displayName = 'ToolbarDropdown'

export default ToolbarDropdown
