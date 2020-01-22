import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { NotFoundPageError } from '~/lib/next/errors'
import Layout from '../Layout'
import { LayoutProps } from '../Layout/Layout'
import { Page, PageAs, Color, Config } from '~/common'
import { useIntl, defineMessages } from 'react-intl'
import { UserOrganization } from '~/redux/ducks/user'
import { Organization } from '~/redux/ducks/organization'

const Body = styled.div`
  &.p-toolbar-nav {
    padding-top: ${Config.toolbar.height + 50}px;
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
    box-shadow: inset 0 -2px ${Color.secondary[500]};
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
  background-size: contain;
  background-position: center;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`

const m = defineMessages({
  page: { id: 'organizationLayout.page', defaultMessage: 'Página' },
  newProject: {
    id: 'organizationLayout.newProject',
    defaultMessage: 'Criar vaga',
  },
  manageProjects: {
    id: 'organizationLayout.manageProjects',
    defaultMessage: 'Gerenciar vagas',
  },
  members: { id: 'organizationLayout.members', defaultMessage: 'Membros' },
  editOrganization: {
    id: 'organizationLayout.editOrganization',
    defaultMessage: 'Editar ONG',
  },
  inbox: { id: 'organizationLayout.inbox', defaultMessage: 'Caixa de Entrada' },
})

interface OrganizationLayoutProps {
  readonly className?: string
  readonly isViewerMember?: boolean
  readonly organization?: UserOrganization | Organization
  readonly layoutProps?: LayoutProps
  readonly children: React.ReactNode
}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({
  className,
  organization,
  children,
  layoutProps,
  isViewerMember,
}) => {
  const { pathname } = useRouter() || { pathname: '' }
  const intl = useIntl()

  return (
    <div className={className}>
      <Layout toolbarProps={{ flat: true, fixed: true }} {...layoutProps}>
        {isViewerMember && organization && (
          <DashboardNav>
            <DashboardNavInner className="scrollbar-hidden">
              <div className="navbar navbar-expand navbar-light flex-no-wrap">
                <div className="container px-2">
                  <ul className="nav navbar-nav flex-no-wrap">
                    <li>
                      <Link
                        href={Page.Organization}
                        as={PageAs.Organization({
                          organizationSlug: organization.slug,
                        })}
                      >
                        <CurrentOrganizationLink
                          href={`/ong/${organization.slug}`}
                          className="nav-link truncate"
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
                        pathname === Page.OrganizationAbout ||
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
                        <a className="nav-link">{intl.formatMessage(m.page)}</a>
                      </Link>
                    </li>
                    <li
                      className={
                        pathname === Page.NewProject ||
                        pathname === Page.OrganizationNewProject
                          ? 'active'
                          : ''
                      }
                    >
                      <Link
                        href={Page.OrganizationNewProject}
                        as={PageAs.OrganizationNewProject({
                          organizationSlug: organization.slug,
                          stepId: 'inicio',
                        })}
                      >
                        <a className="nav-link">
                          {intl.formatMessage(m.newProject)}
                        </a>
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
                        <a className="nav-link">
                          {intl.formatMessage(m.manageProjects)}
                        </a>
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
                        <a className="nav-link">
                          {intl.formatMessage(m.members)}
                        </a>
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
                          stepId: 'basics',
                        })}
                      >
                        <a className="nav-link">
                          {intl.formatMessage(m.editOrganization)}
                        </a>
                      </Link>
                    </li>
                    {Config.chat.enabled &&
                      (!Config.chat.beta || organization.chat_enabled) && (
                        <li className={pathname === '/inbox' ? 'active' : ''}>
                          <Link
                            href={Page.Inbox}
                            as={PageAs.Inbox({ slug: organization.slug })}
                          >
                            <a className="nav-link">
                              {intl.formatMessage(m.inbox)}
                            </a>
                          </Link>
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </DashboardNavInner>
          </DashboardNav>
        )}
        <Body className={isViewerMember ? 'p-toolbar-nav' : 'p-toolbar'}>
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
