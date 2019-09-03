import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { SearchType } from '~/redux/ducks/search'
import { RootState } from '~/redux/root-reducer'
import Authentication from '../Authentication'
import Collapse from '../Collapse'
import Icon from '../Icon'
import { useModal } from '../Modal'
import { Page, PageAs } from '~/common'

const MobileCollapse = styled(Collapse)`
  a {
    vertical-align: middle;

    .icon {
      font-size: 20px;
      color: #666;
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
    componentProps: {
      defaulPath: '/login',
    },
  })

  return (
    <MobileCollapse
      collapsed={collapsed}
      className="navbar-collapse-dropdown bg-white"
      containerClassName="nav container px-0 flex-column ts-medium py-2"
    >
      <a
        href="/"
        className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium"
      >
        <Icon name="home" />
        Início
      </a>
      <Link
        href={{
          pathname: Page.SearchProjects,
          query: { searchType: SearchType.Projects },
        }}
        as={PageAs.SearchProjects()}
      >
        <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium">
          <Icon name="search" />
          {intl.formatMessage(messages.explore)}
        </a>
      </Link>

      <Link href={Page.FAQ}>
        <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium">
          <Icon name="help_outline" />
          {intl.formatMessage(messages.faq)}
        </a>
      </Link>
      {viewerOrganizations.length === 0 && (
        <Link href={{ pathname: '/organization-composer' }} as="/sou-uma-ong">
          <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium">
            <Icon name="favorite_outline" />
            {intl.formatMessage(messages.imOrganization)}
          </a>
        </Link>
      )}
      {viewerOrganizations.map(organization => (
        <React.Fragment key={organization.slug}>
          <hr className="hr-muted w-100 my-1" />
          <Link
            href={Page.Organization}
            as={PageAs.Organization({ slug: organization.slug })}
          >
            <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium flex">
              <span
                className={`d-inline-block w-32 h-32 bg-cover rounded-lg mr-3 vertical-align-top${
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
                <span className="ts-small block tc-muted">
                  Clique gerenciar essa ONG
                </span>
              </div>
            </a>
          </Link>
          <Collapse />
          <hr className="hr-muted w-100 my-1" />
        </React.Fragment>
      ))}
      {viewer && (
        <>
          <Link href={Page.Viewer} as={Page.Viewer}>
            <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium">
              <Icon name="person" />
              Meu perfil como voluntário
            </a>
          </Link>
          <Link
            href={{
              pathname: '/settings-user',
              query: { slug: viewer.slug },
            }}
            as="/configuracoes/perfil"
          >
            <a className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium">
              <Icon name="settings" />
              Configurações
            </a>
          </Link>
        </>
      )}
      <hr className="hr-muted w-100 my-1" />
      {viewer && (
        <a
          href="/sair"
          className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium"
        >
          <Icon name="exit_to_app" />
          Sair
        </a>
      )}
      {!viewer && (
        <a
          href="/sair"
          className="hover:bg-muted td-hover-none block px-3 py-2 tc-base ts-medium"
          onClick={event => {
            event.preventDefault()
            openAuthentication()
          }}
        >
          <Icon name="person" />
          Entrar
        </a>
      )}
    </MobileCollapse>
  )
}

ToolbarMobileNav.displayName = 'ToolbarMobileNav'

export default ToolbarMobileNav
