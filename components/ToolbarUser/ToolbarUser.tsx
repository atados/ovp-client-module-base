import Link from 'next/link'
import { withRouter, WithRouterProps } from 'next/router'
import React, { useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import Authentication from '~/components/Authentication'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Icon from '~/components/Icon'
import { ModalLink } from '~/components/Modal'
import { InboxViewer } from '~/redux/ducks/inbox'
import { User } from '~/redux/ducks/user'
import ToolbarApplications from '../Toolbar/ToolbarApplications'
import AppNotificationWatcher from './components/AppNotificationWatcher'
import ToolbarHelp from './components/ToolbarHelp'
import ToolbarMessagesDropdown from './components/ToolbarMessagesDropdown'

interface ToolbarUserProps {
  readonly user: User | null
  readonly className?: string
  readonly darkIcons?: boolean
  readonly inboxViewers: InboxViewer[]
}

const Avatar = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eee;
  vertical-align: top;
  display: inline-block;
  border: 2px solid #fff;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-right: 24px;

  > .icon {
    color: rgba(0, 0, 0, 0.4);
    font-size: 20px;
    line-height: 1.9;
    float: right;
    margin-right: -28px;
  }
`

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  width: 240px;
  left: auto;
  padding: 10px 0;
`

const DropdownAnchor = styled.a`
  display: block;
  padding: 7px 5px 7px 16px;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;

  &:hover {
    background: #f6f7f8;
    text-decoration: none;
  }

  > .icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 10px;
    width: 20px;
    color: #666;
  }

  &:hover,
  &:hover .icon {
    color: ${channel.theme.colorPrimary};
  }
`

const UserDropdown = styled(Dropdown)`
  height: 36px;

  &.theme-light {
    > a > .icon {
      color: rgba(0, 0, 0, 0.7);
    }

    &.open > a > .icon {
      color: #333;
    }
  }

  &.theme-dark {
    > a > .icon {
      color: rgba(255, 255, 255, 0.7);
    }

    &.open > a > .icon {
      color: #fff;
    }
  }
`

interface ToolbarUserProps {
  readonly className?: string
  readonly theme?: 'dark' | 'light'
}

const ToolbarUser: React.FC<ToolbarUserProps & WithRouterProps> = ({
  inboxViewers,
  user,
  router,
  theme = 'dark',
}) => {
  // @ts-ignore
  const toolbarHelp = <ToolbarHelp className="mr-2" />
  const chatEnabled =
    user &&
    (channel.config.chat.enabled &&
      (!channel.config.chat.beta || user.chat_enabled))

  const dropdownRef = useRef<Dropdown | null>(null)
  const handleDropdownToggle = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()

      if (dropdownRef.current) {
        dropdownRef.current.toggle()
      }
    },
    [dropdownRef.current],
  )

  if (user) {
    return (
      <div className="nav">
        {chatEnabled && (
          <AppNotificationWatcher user={user} inboxViewers={inboxViewers} />
        )}
        <ToolbarApplications viewer={user} theme={theme} />
        {chatEnabled && <ToolbarMessagesDropdown />}
        <UserDropdown ref={dropdownRef} className={`theme-${theme}`}>
          <Avatar
            href={`/voluntario/${user.slug}`}
            onClick={handleDropdownToggle}
            style={
              user.avatar
                ? { backgroundImage: `url('${user.avatar.image_url}')` }
                : { backgroundColor: user.profile.color }
            }
          >
            <Icon name="keyboard_arrow_down" className="dropdownArrow" />
          </Avatar>
          <Menu className="mt-1">
            <Link
              href={{
                pathname: resolvePage('/public-user'),
                query: { slug: user.slug },
              }}
              as="/perfil"
            >
              <DropdownAnchor href="/perfil">
                <Icon name="person" />
                Meu perfil de voluntário
              </DropdownAnchor>
            </Link>

            <Link
              href={{
                pathname: resolvePage('/settings-user'),
                query: { slug: user.slug },
              }}
              as="/configuracoes/perfil"
            >
              <DropdownAnchor href="/configuracoes/perfil">
                <Icon name="settings" />
                Configurações
              </DropdownAnchor>
            </Link>
            <hr className="my-1" />
            {channel.config.user.createProject === true && (
              <>
                <Link href={resolvePage('/project-composer')} as="/criar-vaga">
                  <DropdownAnchor href="/criar-vaga">
                    <Icon name="add" />
                    Criar vaga
                  </DropdownAnchor>
                </Link>
                <Link
                  href={resolvePage('/created-projects-list')}
                  as="/minhas-vagas"
                >
                  <DropdownAnchor href="/minhas-vagas">
                    <Icon name="group" />
                    Gerenciar minhas vagas
                  </DropdownAnchor>
                </Link>
              </>
            )}
            <Link
              href={resolvePage('/settings-organizations')}
              as="/configuracoes/ongs"
            >
              <DropdownAnchor href="/configuracoes/ongs">
                <Icon name="group" />
                ONGs que participo
              </DropdownAnchor>
            </Link>
            <Link
              href={resolvePage('/organization-composer')}
              as="/sou-uma-ong"
            >
              <DropdownAnchor href="/sou-uma-ong">
                <Icon name="add" />
                Registrar nova ONG
              </DropdownAnchor>
            </Link>
            <hr className="my-1" />
            <DropdownAnchor href="/sair">
              <Icon name="exit_to_app" />
              Sair
            </DropdownAnchor>
          </Menu>
        </UserDropdown>
      </div>
    )
  }

  return (
    <div className="nav">
      <ModalLink
        id="Authentication"
        component={Authentication}
        componentProps={{
          defaultPath: '/register',
          successRedirect: router!.asPath,
        }}
        cardClassName="p-5"
      >
        <a href="/entrar/cadastro" className="nav-link">
          Cadastrar-se
        </a>
      </ModalLink>
      <ModalLink
        id="Authentication"
        component={Authentication}
        componentProps={{
          defaultPath: '/login',
          successRedirect: router!.asPath,
        }}
        cardClassName="p-5"
      >
        <a href="/entrar" className="nav-link">
          Entrar
        </a>
      </ModalLink>
      {toolbarHelp}
    </div>
  )
}

ToolbarUser.displayName = 'ToolbarUser'

const mapStateToProps = ({ inboxViewers, user }) => {
  {
    const viewers: InboxViewer[] = []
    inboxViewers.forEach(item => {
      if (
        !viewers.some(
          viewer =>
            viewer.id === item.viewer.id && viewer.kind === item.viewer.kind,
        )
      ) {
        viewers.push(item.viewer)
      }
    })

    return {
      user,
      inboxViewers: viewers,
    }
  }
}

export default connect(mapStateToProps)(
  withRouter<ToolbarUserProps>(ToolbarUser),
)
