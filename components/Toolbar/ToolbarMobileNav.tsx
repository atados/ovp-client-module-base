import Link from 'next/link'
import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { RootState } from '~/redux/root-reducer'
import Authentication from '../Authentication'
import Collapse from '../Collapse'
import Icon from '../Icon'
import { useModal } from '../Modal'
import { Page, PageAs, Color } from '~/common'
import Router from 'next/router'
import { logout } from '~/redux/ducks/user'
import VolunteerIcon from '../Icon/VolunteerIcon'
import ViewerApplications from '../ViewerApplications'

const MobileCollapse = styled(Collapse)`
  a,
  button {
    vertical-align: middle;

    > .icon,
    > svg {
      font-size: 20px;
      color: ${Color.gray[700]};
      margin-right: 14px;
      width: 32px;
      text-align: center;
    }
  }
`

const messages = defineMessages({
  imOrganization: {
    id: 'toolbar.im_organization',
    defaultMessage: 'Sou uma ONG',
  },
  explore: {
    id: 'toolbar.mobile.explore',
    defaultMessage: 'Buscar vagas de voluntariado',
  },
  faq: {
    id: 'toolbar.mobile.faq',
    defaultMessage: 'Ajuda',
  },
})

interface ToolbarMobileNavProps {
  readonly collapsed?: boolean
}

const ToolbarMobileNav: React.FC<ToolbarMobileNavProps> = ({ collapsed }) => {
  const intl = useIntl()
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const viewerOrganizations = (viewer && viewer.organizations) || []
  const openAuthentication = useModal({
    id: 'Authentication',
    component: Authentication,
    cardClassName: 'p-5',
  })
  const openApplicationsModal = useModal({
    id: 'ViewerApplications',
    component: ViewerApplications,
    componentProps: {
      scroll: false,
    },
  })
  const dispatchToRedux = useDispatch()
  const handleLogout = (e: React.MouseEvent<any>) => {
    e.preventDefault()
    Router.push(Page.Home)
    dispatchToRedux(logout())
  }

  return (
    <MobileCollapse
      collapsed={collapsed}
      className="navbar-collapse-dropdown bg-white"
      containerClassName="container px-0 text-lg py-3"
    >
      <a
        href="/"
        className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg"
      >
        <Icon name="home" />
        <FormattedMessage id="toolbarMobileNav.home" defaultMessage="Início" />
      </a>
      <Link href={Page.SearchProjects}>
        <a className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg">
          <Icon name="search" />
          {intl.formatMessage(messages.explore)}
        </a>
      </Link>

      <Link href={Page.FAQ}>
        <a className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg">
          <Icon name="help_outline" />
          {intl.formatMessage(messages.faq)}
        </a>
      </Link>
      {viewerOrganizations.length === 0 && (
        <Link href={Page.OrganizationOnboarding}>
          <a className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg">
            <Icon name="favorite_outline" />
            {intl.formatMessage(messages.imOrganization)}
          </a>
        </Link>
      )}
      {viewerOrganizations.map(organization => (
        <React.Fragment key={organization.slug}>
          <hr className="hr-muted w-full my-1" />
          <Link
            href={Page.Organization}
            as={PageAs.Organization({ organizationSlug: organization.slug })}
          >
            <a className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg flex">
              <span
                className={`inline-block w-8 h-8 bg-cover bg-center rounded-lg mr-4 vertical-align-top${
                  organization.image ? '' : 'bg-muted'
                }`}
                style={
                  organization.image
                    ? {
                        backgroundImage: `url('${organization.image.image_url}')`,
                      }
                    : undefined
                }
              />
              <div className="flex-grow">
                {organization.name}
                <span className="text-sm block w-full text-gray-600">
                  <FormattedMessage
                    id="toolbarMobileNav.manage"
                    defaultMessage="Clique gerenciar essa ONG"
                  />
                </span>
              </div>
            </a>
          </Link>
          <Collapse />
          <hr className="hr-muted w-full my-1" />
        </React.Fragment>
      ))}
      {viewer && (
        <>
          <Link href={Page.Viewer}>
            <a className="block hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg">
              <div
                className="icon w-8 h-8 bg-gray-200 rounded-full inline-block align-middle bg-contain"
                style={
                  viewer.avatar
                    ? {
                        backgroundImage: `url('${viewer.avatar.image_url}')`,
                        backgroundColor: 'none',
                      }
                    : undefined
                }
              >
                {!viewer.avatar && (
                  <Icon name="person" className="text-gray-400" />
                )}
              </div>
              <FormattedMessage
                id="toolbarMobileNav.profile"
                defaultMessage="Meu perfil como voluntário"
              />
            </a>
          </Link>
          <button
            className="hover:bg-gray-200 bg-white border-0 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg text-left cursor-pointer"
            onClick={() => openApplicationsModal()}
          >
            <VolunteerIcon width={20} height={20} fill={Color.gray[700]} />
            <FormattedMessage
              id="toolbarMobileNav.applications"
              defaultMessage="Minhas inscrições"
            />
          </button>
          <Link href={Page.ViewerSettings}>
            <a className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg">
              <Icon name="settings" />
              <FormattedMessage
                id="toolbarMobileNav.settings"
                defaultMessage="Configurações"
              />
            </a>
          </Link>
        </>
      )}
      <hr className="hr-muted w-full my-1" />
      {viewer && (
        <Link href={Page.Home} passHref>
          <a
            className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg"
            onClick={handleLogout}
          >
            <Icon name="exit_to_app" />
            <FormattedMessage
              id="toolbarMobileNav.logout"
              defaultMessage="Sair"
            />
          </a>
        </Link>
      )}
      {!viewer && (
        <a
          href="/sair"
          className="hover:bg-gray-200 td-hover-none block w-full px-4 py-3 text-gray-800 text-lg"
          onClick={event => {
            event.preventDefault()
            openAuthentication()
          }}
        >
          <Icon name="person" />
          <FormattedMessage
            id="toolbarMobileNav.login"
            defaultMessage="Entrar"
          />
        </a>
      )}
    </MobileCollapse>
  )
}

ToolbarMobileNav.displayName = 'ToolbarMobileNav'

export default ToolbarMobileNav
