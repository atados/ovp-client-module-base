import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { Page } from '~/common'
import { Organization } from '~/redux/ducks/organization'
import { channel } from '~/base/common/constants'

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
    box-shadow: -2px 0 ${channel.theme.color.secondary[500]};
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
    pathname: Page.Organization,
    label: 'Página inicial',
    as: '',
  },
  {
    pathname: Page.OrganizationProjects,
    label: 'Vagas',
    as: '/vagas',
  },
]

const OrganizationLayoutNav: React.FC<OrganizationLayoutNavProps> = ({
  organization,
  onShare,
}) => {
  const router = useRouter()
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
            className={
              router && router.pathname === item.pathname ? 'active' : ''
            }
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

export default React.memo(OrganizationLayoutNav)
