import Link from 'next/link'
import { withRouter, WithRouterProps } from 'next/router'
import * as React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { Organization } from '~/redux/ducks/organization'

const Nav = styled.div``

const NavItem = styled.a`
  border-top: 1px solid #eee;
  display: block;
  padding: 6px 12px;
  color: #555;
  width: 100%;
  text-align: left;
  font-size: 14px;

  &:hover {
    background: #f6f6f6;
    color: #444;
  }

  &.active {
    color: #222;
    font-weight: 500;
    background: #f6f6f6;
    box-shadow: -2px 0 ${props => props.theme.colorSecondary};
  }
`

interface OrganizationLayoutNavProps {
  readonly organization: Organization
  readonly onShare: () => void
}

interface NavItemType {
  pathname: string
  label: string
  as: string
}

const items: NavItemType[] = [
  {
    pathname: resolvePage('/organization'),
    label: 'Página inicial',
    as: '',
  },
  {
    pathname: resolvePage('/organization-projects'),
    label: 'Vagas',
    as: '/vagas',
  },
]

const OrganizationLayoutNav: React.SFC<
  OrganizationLayoutNavProps & WithRouterProps
> = ({ organization, onShare, router }) => {
  return (
    <Nav className="mt-3">
      {items.map(item => (
        <Link
          key={item.label}
          href={{
            pathname: item.pathname,
            query: { slug: organization.slug },
          }}
          as={`/ong/${organization.slug}${item.as}`}
        >
          <NavItem
            href={`/ong/${organization.slug}${item.as}`}
            className={router!.pathname === item.pathname ? 'active' : ''}
          >
            {item.label}
          </NavItem>
        </Link>
      ))}
      <NavItem
        as="button"
        className="tc-muted-dark btn-plain-text tc-link"
        onClick={onShare}
      >
        Compartilhar
      </NavItem>
    </Nav>
  )
}

OrganizationLayoutNav.displayName = 'OrganizationLayoutNav'

export default React.memo(
  withRouter<OrganizationLayoutNavProps>(OrganizationLayoutNav),
)
