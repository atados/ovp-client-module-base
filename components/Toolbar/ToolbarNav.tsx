import * as React from 'react'
import styled from 'styled-components'

interface ToolbarNavProps {
  readonly className?: string
  readonly children?: React.ReactNode
}

const Nav = styled.ul`
  .nav-link {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
`

const ToolbarNav: React.SFC<ToolbarNavProps> = ({ className, children }) => (
  <Nav className={`navbar-nav d-none d-lg-flex ${className}`}>
    {React.Children.map(children, (child: React.ReactElement<any>) => (
      <li className="nav-item">
        {React.cloneElement(child, {
          className: 'nav-link',
        })}
      </li>
    ))}
  </Nav>
)

ToolbarNav.displayName = 'ToolbarNav'
ToolbarNav.defaultProps = {
  className: '',
}

export default ToolbarNav
