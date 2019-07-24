import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import useIntl from '~/hooks/use-intl'
import { SearchType } from '~/redux/ducks/search'
import { RootState } from '~/redux/root-reducer'
import Authentication from '../Authentication'
import Collapse from '../Collapse'
import Icon from '../Icon'
import { useModal } from '../Modal'

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
        className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium"
      >
        <Icon name="home" />
        Início
      </a>
      <Link
        href={{
          pathname: resolvePage('/explore'),
          query: { searchType: SearchType.Projects },
        }}
        as="/vagas"
      >
        <a className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium">
          <Icon name="search" />
          {intl.formatMessage(messages.explore)}
        </a>
      </Link>
      {viewerOrganizations.length === 0 && (
        <Link
          href={{ pathname: resolvePage('/organization-composer') }}
          as="/sou-uma-ong"
        >
          <a className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium">
            <Icon name="favorite_outline" />
            {intl.formatMessage(messages.imOrganization)}
          </a>
        </Link>
      )}
      {viewerOrganizations.map(organization => (
        <React.Fragment key={organization.slug}>
          <hr className="hr-muted w-100 my-1" />
          <Link
            href={{
              pathname: '/organization',
              query: { slug: organization.slug },
            }}
            as={`/ong/${organization.slug}`}
          >
            <a className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium d-flex">
              <span
                className={`d-inline-block w-32 h-32 bg-cover rounded-lg mr-3 vertical-align-top${
                  organization.image ? '' : 'bg-muted'
                }`}
                style={
                  organization.image
                    ? {
                        backgroundImage: `url('${
                          organization.image.image_url
                        }')`,
                      }
                    : undefined
                }
              />
              <div className="flex-grow">
                {organization.name}
                <span className="ts-small d-block tc-muted">
                  Clique gerenciar essa ONG
                </span>
              </div>
            </a>
          </Link>
          <Collapse />
        </React.Fragment>
      ))}
      <hr className="hr-muted w-100 my-1" />
      {viewer && (
        <>
          <Link
            href={{
              pathname: resolvePage('/public-user'),
              query: { slug: viewer.slug },
            }}
            as="/perfil"
          >
            <a className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium">
              <Icon name="person" />
              Meu perfil como voluntário
            </a>
          </Link>
          <Link
            href={{
              pathname: resolvePage('/settings-user'),
              query: { slug: viewer.slug },
            }}
            as="/configuracoes/perfil"
          >
            <a className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium">
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
          className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium"
        >
          <Icon name="exit_to_app" />
          Sair
        </a>
      )}
      {!viewer && (
        <a
          href="/sair"
          className="hover:bg-muted td-hover-none d-block px-3 py-2 tc-base ts-medium"
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
