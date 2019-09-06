import Link from 'next/link'
import React, { useCallback, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import Authentication from '~/components/Authentication'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Icon from '~/components/Icon'
import { ModalLink } from '~/components/Modal'
import { InboxViewer } from '~/redux/ducks/inbox'
import { User, logout } from '~/redux/ducks/user'
import ToolbarApplications from '../Toolbar/ToolbarApplications'
import AppNotificationWatcher from './components/AppNotificationWatcher'
import ToolbarMessagesDropdown from './components/ToolbarMessagesDropdown'
import { Page } from '~/base/common'

interface ToolbarUserProps {
  readonly user: User | null
  readonly className?: string
  readonly theme?: 'dark' | 'light'
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
    color: ${channel.theme.color.primary[500]};
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

const ToolbarUser: React.FC<ToolbarUserProps> = ({
  inboxViewers,
  user,
  theme = 'dark',
}) => {
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

  const dispatchToRedux = useDispatch()
  const handleLogout = () => {
    dispatchToRedux(logout())
  }

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
            <Link href={Page.Viewer} passHref>
              <DropdownAnchor>
                <Icon name="person" />
                Meu perfil de voluntário
              </DropdownAnchor>
            </Link>

            <Link href={Page.ViewerSettings} passHref>
              <DropdownAnchor>
                <Icon name="settings" />
                Configurações
              </DropdownAnchor>
            </Link>
            <hr className="my-1" />
            {channel.config.user.createProject === true && (
              <>
                <Link href={Page.NewProject} passHref>
                  <DropdownAnchor>
                    <Icon name="add" />
                    Criar vaga
                  </DropdownAnchor>
                </Link>
                <Link href={Page.ViewerProjects} passHref>
                  <DropdownAnchor href="/minhas-vagas">
                    <Icon name="group" />
                    Gerenciar minhas vagas
                  </DropdownAnchor>
                </Link>
              </>
            )}
            {channel.config.organization.enabled && (
              <>
                <Link href={Page.ViewerOrganizations} passHref>
                  <DropdownAnchor>
                    <Icon name="group" />
                    ONGs que participo
                  </DropdownAnchor>
                </Link>
                <Link href={Page.NewOrganization}>
                  <DropdownAnchor>
                    <Icon name="add" />
                    Registrar nova ONG
                  </DropdownAnchor>
                </Link>
              </>
            )}
            <hr className="my-1" />
            <Link href={Page.Home} passHref>
              <DropdownAnchor onClick={handleLogout}>
                <Icon name="exit_to_app" />
                Sair
              </DropdownAnchor>
            </Link>
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
        cardClassName="p-5"
      >
        <a id="toolbar-auth-button" href="/entrar" className="nav-link">
          Entrar
        </a>
      </ModalLink>
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

export default connect(mapStateToProps)(ToolbarUser)
