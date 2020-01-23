import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '~/redux/root-reducer'
import SearchForm from '../SearchForm'
import ToolbarUser from '../ToolbarUser'
import ToolbarBrand from '~/components/Toolbar/ToolbarBrand'
import EmailConfirmationAlert from '~/components/Toolbar/EmailConfirmationAlert'
import ToolbarMobileNav from '~/components/Toolbar/ToolbarMobileNav'
import ToolbarOrganizationDropdown from '~/components/Toolbar/ToolbarOrganizationDropdown'
import ToolbarVolunteerDropdown from '~/components/Toolbar/ToolbarVolunteerDropdown'
import { Page, PageAs, Theme, Config } from '~/common'
import { FormattedMessage } from 'react-intl'
import PageLink from '../PageLink'

const ToolbarStyled = styled.div`
  height: ${Config.toolbar.height}px;
  background: ${Config.toolbar.background || Theme.color.primary[500]};
  z-index: 400;

  .toolbarOrganization {
    max-width: 180px;
  }

  .navbar-dark .text-toolbar {
    color: #fff;
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

export interface ToolbarProps {
  readonly className?: string
  readonly brand?: React.ReactNode
  readonly theme?: 'dark' | 'light'
  readonly fixed?: boolean
  readonly flat?: boolean
  readonly float?: boolean
  readonly searchFormEnabled?: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  brand,
  fixed,
  theme = 'dark',
  flat,
  float,
  searchFormEnabled = true,
}) => {
  const [state, setState] = useState({
    collapsed: true,
    searchFormFocused: false,
  })
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const viewerOrganizations = (viewer && viewer.organizations) || []

  const handleTogglerClick = () => {
    setState({ searchFormFocused: false, collapsed: !state.collapsed })
  }
  const handleSearchFormOpenStateChange = useCallback(
    (isFocused: boolean) =>
      setState(prevState => ({ ...prevState, searchFormFocused: isFocused })),
    [setState],
  )

  return (
    <>
      <EmailConfirmationAlert user={viewer} />
      <style>{`
        .p-toolbar {
          padding-top: ${Config.toolbar.height}px;
        }
      `}</style>
      <ToolbarStyled
        className={`${
          fixed || float
            ? `${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0`
            : 'relative'
        } ${!flat ? 'shadow' : ''} ${className || ''}`}
      >
        <Navbar
          className={`h-full navbar lg:navbar-expand px-0 navbar-${theme}`}
        >
          <div className="container max-w-full px-2">
            {brand || (
              <PageLink href="Home" passHref>
                <ToolbarBrand
                  className={`mr-2 ${
                    state.searchFormFocused ? 'hidden md:block' : ''
                  }`}
                />
              </PageLink>
            )}
            {searchFormEnabled && (
              // @ts-ignore
              <SearchForm
                onOpenStateChange={handleSearchFormOpenStateChange}
                theme={theme}
              />
            )}

            <div className="mr-auto" />
            <Nav className="navbar-nav hidden lg:flex">
              {Config.toolbar.links.map(link => (
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
                <ToolbarVolunteerDropdown />
              </li>
              {Config.organization.enabled && (
                <li className="mr-2">
                  <ToolbarOrganizationDropdown
                    organization={viewerOrganizations[0]}
                    theme={theme}
                    className={viewerOrganizations[0] ? 'ml-2' : ''}
                  />
                </li>
              )}
              <li>
                <ToolbarUser theme={theme} />
              </li>
              <li>
                <Link href={Page.FAQ} as={PageAs.FAQ()}>
                  <a className="nav-link">
                    <FormattedMessage
                      id="toolbar.help"
                      defaultMessage="Ajuda"
                    />
                  </a>
                </Link>
              </li>
            </Nav>
            <button
              className={`btn ${theme === 'dark' ? 'bg-light' : ''} ${
                state.searchFormFocused ? 'hidden md:block' : ''
              } lg:hidden navbar-toggler leading-normal rounded-full w-10 h-10 px-0`}
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
    </>
  )
}

Toolbar.displayName = 'Toolbar'

export default React.memo(Toolbar)
