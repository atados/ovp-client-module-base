import { NextContext } from 'next'
import Link from 'next/link'
import { withRouter, WithRouterProps } from 'next/router'
import * as React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import { NotFoundPageError } from '~/lib/next/errors'
import Dropdown, { DropdownMenu } from '../Dropdown'
import Layout from '../Layout'
import { LayoutProps } from '../Layout/Layout'
import Meta from '../Meta'

const Body = styled.div`
  &.p-toolbar-nav {
    padding-top: ${props => props.theme.toolbarHeight + 50}px;
  }
`

const DashboardNav = styled.div`
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  z-index: 99;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

  .navbar-nav > li {
    margin-right: 0.4rem;
  }

  .navbar {
    padding: 0;
  }

  ul.navbar-nav > li {
    padding-top: 7px;
    padding-bottom: 7px;
  }

  ul.navbar-nav > li.active {
    font-weight: 500;
    box-shadow: inset 0 -2px ${props => props.theme.colorSecondary};
  }

  ul.navbar-nav > li.active .nav-link {
    color: #222;
  }
`

const DashboardNavInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  white-space: nowrap;

  &.has-popover {
    height: 100vh;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .navbar-nav {
    min-width: 500px;
  }
`

const Popover = styled(DropdownMenu)`
  position: absolute;
  z-index: 10200;
  background: ${props => props.theme.colorPrimary};
  padding: 16px;
  border-radius: 4px;
  margin-top: 10px;
  top: 100%;
  width: 300px;
  white-space: normal;

  &::after {
    content: '';
    border-width: 0 8px 8px;
    border-color: ${props => props.theme.colorPrimary} rgba(0, 0, 0, 0);
    border-style: solid;
    width: 0;
    height: 0;
    position: absolute;
    top: -8px;
    left: 16px;
    display: block;
  }
`

const CurrentOrganizationLink = styled.a`
  display: block;
  padding-right: 16px !important;
  padding-left: 42px !important;
  margin-right: 10px;
  border-right: 1px solid #eee;
  position: relative;
  max-width: 300px;
`

const CurrentOrganizationImage = styled.figure`
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`

interface OrganizationLayoutProps {
  readonly className?: string
  readonly organization: {
    slug: string
    name: string
    description: string
    image?: {
      image_url: string
    }
    chat_enabled?: boolean
  }
  readonly isCurrentUserMember: boolean
  readonly layoutProps?: LayoutProps
}

interface OrganizationLayoutState {
  isPopoverOpen: boolean
}

class OrganizationLayout extends React.Component<
  OrganizationLayoutProps & WithRouterProps,
  OrganizationLayoutState
> {
  public static getDerivedStateFromProps(
    _: OrganizationLayoutProps,
    state?: OrganizationLayoutState,
  ): OrganizationLayoutState {
    return {
      isPopoverOpen: state ? state.isPopoverOpen : false,
    }
  }

  constructor(props) {
    super(props)

    this.state = OrganizationLayout.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    if (this.props.isCurrentUserMember) {
      const hasViewedMembersPopover = localStorage.getItem(
        '@@popover/organization/members',
      )

      if (!hasViewedMembersPopover) {
        this.setState({ isPopoverOpen: true })
      }
    }
  }

  public handlePopoverOpenStateChange = isOpen => {
    if (!isOpen) {
      localStorage.setItem('@@popover/organization/members', String(Date.now()))
    }

    this.setState({ isPopoverOpen: isOpen })
  }

  public closePopover = () => {
    localStorage.setItem('@@popover/organization/members', String(Date.now()))
    this.setState({
      isPopoverOpen: false,
    })
  }

  public render() {
    const {
      className,
      organization,
      isCurrentUserMember,
      children,
      router,
      layoutProps,
    } = this.props
    const { isPopoverOpen } = this.state

    return (
      <div className={className}>
        <Meta
          title={organization.name}
          description={organization.description}
          image={organization.image && organization.image.image_url}
        />
        <Layout toolbarProps={{ flat: true, fixed: true }} {...layoutProps}>
          {isCurrentUserMember && (
            <DashboardNav>
              <DashboardNavInner className={isPopoverOpen ? 'has-popover' : ''}>
                <div className="navbar navbar-expand navbar-light">
                  <div className="container">
                    <ul className="nav navbar-nav">
                      <li>
                        <Link
                          href={{
                            pathname: resolvePage('/organization'),
                            query: { slug: organization.slug },
                          }}
                          as={`/ong/${organization.slug}`}
                        >
                          <CurrentOrganizationLink
                            href={`/ong/${organization.slug}`}
                            className="nav-link text-truncate"
                          >
                            <CurrentOrganizationImage
                              style={
                                organization.image
                                  ? {
                                      backgroundImage: `url('${
                                        organization.image.image_url
                                      }')`,
                                    }
                                  : { backgroundColor: '#ddd' }
                              }
                            />
                            {organization.name}
                          </CurrentOrganizationLink>
                        </Link>
                      </li>
                      <li
                        className={
                          router!.pathname === resolvePage('/organization') ||
                          router!.pathname ===
                            resolvePage('/organization-projects')
                            ? 'active'
                            : ''
                        }
                      >
                        <Link
                          href={{
                            pathname: resolvePage('/organization'),
                            query: { slug: organization.slug },
                          }}
                          as={`/ong/${organization.slug}`}
                        >
                          <a className="nav-link">Página</a>
                        </Link>
                      </li>
                      <li
                        className={
                          router!.pathname === resolvePage('/project-composer')
                            ? 'active'
                            : ''
                        }
                      >
                        <Link
                          href={{
                            pathname: resolvePage('/project-composer'),
                            query: { organizationSlug: organization.slug },
                          }}
                          as={`/ong/${organization.slug}/criar-vaga`}
                        >
                          <a className="nav-link">Criar vaga</a>
                        </Link>
                      </li>
                      <li
                        className={
                          router!.pathname === resolvePage('/manage-project') ||
                          router!.pathname ===
                            resolvePage('/manageable-projects-list')
                            ? 'active'
                            : ''
                        }
                      >
                        <Link
                          href={{
                            pathname: resolvePage('/manageable-projects-list'),
                            query: { organizationSlug: organization.slug },
                          }}
                          as={`/ong/${organization.slug}/gerenciar/vagas`}
                        >
                          <a className="nav-link">Gerenciar vagas</a>
                        </Link>
                      </li>
                      <li
                        className={
                          router!.pathname ===
                          resolvePage('/organization-members')
                            ? 'active'
                            : ''
                        }
                      >
                        <Dropdown
                          open={isPopoverOpen}
                          onOpenStateChange={this.handlePopoverOpenStateChange}
                        >
                          <Link
                            href={{
                              pathname: resolvePage('/organization-members'),
                              query: { organizationSlug: organization.slug },
                            }}
                            as={`/ong/${organization.slug}/membros`}
                          >
                            <a className="nav-link">Membros</a>
                          </Link>

                          {isPopoverOpen && (
                            <Popover>
                              <p className="tc-white ts-small">
                                Agora você pode adicionar membros a sua ONG.
                                Envie convites para os usuários fazerem parte
                                disso!
                              </p>
                              <Link
                                href={{
                                  pathname: resolvePage(
                                    '/organization-members',
                                  ),
                                  query: { slug: organization.slug },
                                }}
                                as={`/ong/${organization.slug}/membros`}
                              >
                                <a
                                  onClick={this.closePopover}
                                  className="btn btn-white tc-primary mr-2 btn--size-2"
                                >
                                  Vamos lá!
                                </a>
                              </Link>
                              <button
                                type="button"
                                onClick={this.closePopover}
                                className="btn btn-text tc-white btn--size-2"
                              >
                                Entendi
                              </button>
                            </Popover>
                          )}
                        </Dropdown>
                      </li>
                      <li
                        className={
                          router!.pathname === resolvePage('/organization-edit')
                            ? 'active'
                            : ''
                        }
                      >
                        <Link
                          href={{
                            pathname: resolvePage('/organization-edit'),
                            query: { slug: organization.slug },
                          }}
                          as={`/ong/${organization.slug}/editar`}
                        >
                          <a className="nav-link">Editar ONG</a>
                        </Link>
                      </li>
                      {channel.config.chat.enabled &&
                        (!channel.config.chat.beta ||
                          organization.chat_enabled) && (
                          <li
                            className={
                              router!.pathname === resolvePage('/inbox')
                                ? 'active'
                                : ''
                            }
                          >
                            <Link
                              href={{
                                pathname: resolvePage('/inbox'),
                                query: { viewerSlug: organization.slug },
                              }}
                              as={`/mensagens/${organization.slug}`}
                            >
                              <a className="nav-link">Caixa de entrada</a>
                            </Link>
                          </li>
                        )}
                    </ul>
                  </div>
                </div>
              </DashboardNavInner>
            </DashboardNav>
          )}
          <Body className={isCurrentUserMember ? 'p-toolbar-nav' : 'p-toolbar'}>
            {children}
          </Body>
        </Layout>
      </div>
    )
  }
}

export const getOrganizationLayoutInitialProps = async (
  { store, query }: NextContext,
  mustHavePermission: boolean = false,
) => {
  const slug = query.organizationSlug || query.slug

  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  if (mustHavePermission) {
    const { user } = store.getState()
    if (
      !user ||
      // Check if user has permission to edit this organization
      !user.organizations.some(organization => organization.slug === slug)
    ) {
      throw new NotFoundPageError()
    }
  }
}

export default React.memo(
  withRouter<OrganizationLayoutProps>(OrganizationLayout),
)
