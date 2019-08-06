import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import useIntl from '~/hooks/use-intl'
import { SearchType } from '~/redux/ducks/search'
import { RootState } from '~/redux/root-reducer'
import SearchForm from '../SearchForm'
import ToolbarUser from '../ToolbarUser'
import ToolbarBrand from './ToolbarBrand'
import ToolbarMobileNav from './ToolbarMobileNav'
import ToolbarOrganization from './ToolbarOrganization'

const ToolbarStyled = styled.div`
  height: ${channel.theme.toolbarHeight}px;
  background: ${channel.theme.toolbarBackground || channel.theme.colorPrimary};
  z-index: 400;

  .toolbarOrganization {
    max-width: 180px;
  }
`

const Navbar = styled.div``

const Nav = styled.ul`
  .nav-link {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    height: 40px;
    line-height: 1.85;
  }
`

const messages = defineMessages({
  explore: {
    id: 'toolbar.explore',
    defaultMessage: 'Vagas de voluntariado',
  },
  imOrganization: {
    id: 'toolbar.im_organization',
    defaultMessage: 'Sou uma ONG',
  },
})

export interface ToolbarProps {
  readonly className?: string
  readonly brand?: string
  readonly theme?: 'dark' | 'light'
  readonly fixed?: boolean
  readonly flat?: boolean
  readonly searchFormEnabled?: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  brand,
  fixed,
  theme = 'dark',
  flat,
  searchFormEnabled = true,
}) => {
  const intl = useIntl()
  const [state, setState] = useState({
    collapsed: true,
    searchFormFocused: false,
  })
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const viewerOrganizations = (viewer && viewer.organizations) || []
  const handleSearchFormOpenStateChange = useCallback(
    (isFocused: boolean) =>
      setState(prevState => ({ ...prevState, searchFormFocused: isFocused })),
    [setState],
  )
  const handleTogglerClick = () => {
    setState({ searchFormFocused: false, collapsed: !state.collapsed })
  }

  return (
    <ToolbarStyled
      className={`toolbar ${
        fixed ? 'fixed top-0 left-0 right-0' : 'pos-relative'
      } ${!flat ? 'shadow' : ''} ${className || ''}`}
    >
      <Navbar className={`h-full navbar navbar-expand-lg px-0 navbar-${theme}`}>
        <div className="container w-full">
          <ToolbarBrand
            brand={brand}
            className={state.searchFormFocused ? 'd-none d-md-block' : ''}
          />
          {searchFormEnabled && (
            // @ts-ignore
            <SearchForm
              onOpenStateChange={handleSearchFormOpenStateChange}
              theme={theme}
            />
          )}

          <div className="mr-auto" />
          <Nav className="navbar-nav d-none d-lg-flex">
            {channel.config.toolbar.links.map(link => (
              <li key={link.href + link.as} className="nav-item">
                {link.as ? (
                  <Link href={link.href} as={link.as}>
                    <a className="nav-link">{link.label}</a>
                  </Link>
                ) : (
                  <a href={link.href} className="nav-link">
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            <li className="nav-item">
              <Link
                href={{
                  pathname: resolvePage('/explore'),
                  query: { searchType: SearchType.Projects },
                }}
                as="/vagas"
              >
                <a className="nav-link">
                  {intl.formatMessage(messages.explore)}
                </a>
              </Link>
            </li>
            {viewerOrganizations.length === 0 && (
              <li className="nav-item">
                <Link
                  href={{ pathname: resolvePage('/organization-composer') }}
                  as="/sou-uma-ong"
                >
                  <a className="nav-link">
                    {intl.formatMessage(messages.imOrganization)}
                  </a>
                </Link>
              </li>
            )}
            {viewerOrganizations.length === 1 && (
              <li>
                <ToolbarOrganization
                  organization={viewerOrganizations[0]}
                  className="toolbarOrganization mr-2"
                  theme={theme}
                />
              </li>
            )}
            <li>
              <ToolbarUser theme={theme} />
            </li>
          </Nav>
          <button
            className={`btn ${theme === 'dark' ? 'bg-light' : ''} ${
              state.searchFormFocused ? 'd-none d-md-block' : ''
            } d-lg-none navbar-toggler tl-base rounded-full w-40 h-40 px-0`}
            onClick={handleTogglerClick}
            type="button"
          >
            <div
              className={`hamburger hamburger-slider ${
                theme === 'light' ? '' : 'hamburger-white'
              } ${!state.collapsed ? 'active' : ''}`}
            >
              <div className="hamburger-inner" />
            </div>
          </button>
        </div>
      </Navbar>
      <ToolbarMobileNav collapsed={state.collapsed} />
    </ToolbarStyled>
  )
}

Toolbar.displayName = 'Toolbar'

export default React.memo(Toolbar)
