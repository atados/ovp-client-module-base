import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'

const Nav = styled.ul`
  .nav-link {
    font-size: 14px;
  }

  &.nav-dark a.nav-link {
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: #fff;
    }
  }

  &.nav-light .nav-link,
  &.nav-light .nav-link > a {
    color: #666;

    &:hover {
      color: #333;
    }
  }
`

const Title = styled.h4`
  font-size: 16px !important;
  font-weight: 500;
`

interface FooterNavProps {
  readonly title: string
  readonly className?: string
}

const FooterNav: React.FC<FooterNavProps> = ({
  title,
  children,
  className,
}) => (
  <Nav
    className={`${className ? `${className} ` : ''}nav-${channel.theme
      .footerTheme || 'light'} nav-size-1`}
  >
    <Title className="mb-1">{title}</Title>
    {React.Children.map(children, (child: React.ReactElement<any>) => {
      if (child && child.type !== Link) {
        return React.cloneElement(child, {
          className: `${
            child.props.className ? `${child.props.className} ` : ''
          }nav-link`,
        })
      }

      return child
    })}
  </Nav>
)

FooterNav.displayName = 'FooterNav'
FooterNav.defaultProps = {
  className: undefined,
}

export default FooterNav
