import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { NotFoundPageError } from '~/lib/next/errors'
import Layout from '../Layout'
import { LayoutProps } from '../Layout/Layout'
import Meta from '../Meta'
import { Page, PageAs } from '~/common'

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
    box-shadow: inset 0 -2px ${channel.theme.color.secondary[500]};
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
  readonly children: React.ReactNode
}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({
  className,
  organization,
  isCurrentUserMember,
  children,
  layoutProps,
}) => {
  const { pathname } = useRouter() || { pathname: '' }

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
            <DashboardNavInner>
              <div className="navbar navbar-expand navbar-light">
                <div className="container">
                  <ul className="nav navbar-nav">
                    <li>
                      <Link
                        href={Page.Organization}
                        as={PageAs.Organization({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <CurrentOrganizationLink
                          href={`/ong/${organization.slug}`}
                          className="nav-link text-truncate"
                        >
                          <CurrentOrganizationImage
                            style={
                              organization.image
                                ? {
                                    backgroundImage: `url('${organization.image.image_url}')`,
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
                        pathname === Page.Organization ||
                        pathname === Page.OrganizationProjects
                          ? 'active'
                          : ''
                      }
                    >
                      <Link
                        href={Page.Organization}
                        as={PageAs.Organization({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <a className="nav-link">Página</a>
                      </Link>
                    </li>
                    <li
                      className={
                        pathname === '/project-composer' ? 'active' : ''
                      }
                    >
                      <Link
                        href={Page.OrganizationNewProject}
                        as={PageAs.OrganizationNewProject({
                          organizationSlug: organization.slug,
                          stepId: 'inicio',
                        })}
                      >
                        <a className="nav-link">Criar vaga</a>
                      </Link>
                    </li>
                    <li
                      className={
                        pathname === Page.OrganizationDashboardProject ||
                        pathname === Page.OrganizationDashboardProjectsList
                          ? 'active'
                          : ''
                      }
                    >
                      <Link
                        href={Page.OrganizationDashboardProjectsList}
                        as={PageAs.OrganizationDashboardProjectsList({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <a className="nav-link">Gerenciar vagas</a>
                      </Link>
                    </li>
                    <li
                      className={
                        pathname === Page.OrganizationDashboardMembers
                          ? 'active'
                          : ''
                      }
                    >
                      <Link
                        href={Page.OrganizationDashboardMembers}
                        as={PageAs.OrganizationDashboardMembers({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <a className="nav-link">Membros</a>
                      </Link>
                    </li>
                    <li
                      className={
                        pathname === Page.OrganizationEdit ? 'active' : ''
                      }
                    >
                      <Link
                        href={Page.OrganizationEdit}
                        as={PageAs.OrganizationEdit({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <a className="nav-link">Editar ONG</a>
                      </Link>
                    </li>
                    {channel.config.chat.enabled &&
                      (!channel.config.chat.beta ||
                        organization.chat_enabled) && (
                        <li className={pathname === '/inbox' ? 'active' : ''}>
                          <Link
                            href={Page.Inbox}
                            as={PageAs.Inbox({ slug: organization.slug })}
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

OrganizationLayout.displayName = 'OrganizationLayout'

export const getOrganizationLayoutInitialProps = async (
  { store, query }: NextPageContext,
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

export default React.memo(OrganizationLayout)
