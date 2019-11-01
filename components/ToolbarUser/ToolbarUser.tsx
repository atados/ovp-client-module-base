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
import { Page, PageAs, Color } from '~/base/common'
import Router from 'next/router'
import { defineMessages, useIntl } from 'react-intl'
import PageLink from '../PageLink'

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
    width: 32px;
    height: 32px;
    text-align: center;
    color: ${Color.gray[700]};
    background: ${Color.gray[200]};
    border-radius: 50%;
    line-height: 1.8;
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

const m = defineMessages({
  login: {
    id: 'toolbarUser.login',
    defaultMessage: 'Entrar',
  },
  profile: {
    id: 'toolbarUser.profile',
    defaultMessage: 'Meu perfil de voluntário',
  },
  logout: {
    id: 'toolbarUser.logout',
    defaultMessage: 'Sair',
  },
  newOrganization: {
    id: 'toolbarUser.newOrganization',
    defaultMessage: 'Registrar nova ONG',
  },
  organizations: {
    id: 'toolbarUser.organizations',
    defaultMessage: 'ONGs que participo',
  },
  newProject: {
    id: 'toolbarUser.newProject',
    defaultMessage: 'Criar vaga',
  },
  settings: {
    id: 'toolbarUser.settings',
    defaultMessage: 'Configurações',
  },
  manageMyProjects: {
    id: 'toolbarUser.manageMyProjects',
    defaultMessage: 'Gerenciar minhas vagas',
  },
})

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
  const handleLogout = (e: React.MouseEvent<any>) => {
    e.preventDefault()
    Router.push(Page.Home)
    dispatchToRedux(logout())
  }

  const intl = useIntl()

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
                {intl.formatMessage(m.profile)}
              </DropdownAnchor>
            </Link>

            <Link href={Page.ViewerSettings} passHref>
              <DropdownAnchor>
                <Icon name="settings" />
                {intl.formatMessage(m.settings)}
              </DropdownAnchor>
            </Link>
            <hr className="my-1" />
            {channel.config.user.createProject === true && (
              <>
                <Link
                  href={Page.NewProject}
                  as={PageAs.NewProject({ stepId: 'inicio' })}
                  passHref
                >
                  <DropdownAnchor>
                    <Icon name="add" />
                    {intl.formatMessage(m.newProject)}
                  </DropdownAnchor>
                </Link>
                <Link href={Page.ViewerProjects} passHref>
                  <DropdownAnchor href="/minhas-vagas">
                    <Icon name="group" />
                    {intl.formatMessage(m.manageMyProjects)}
                  </DropdownAnchor>
                </Link>
              </>
            )}
            {channel.config.organization.enabled && (
              <>
                <Link href={Page.ViewerOrganizations} passHref>
                  <DropdownAnchor>
                    <Icon name="group" />
                    {intl.formatMessage(m.organizations)}
                  </DropdownAnchor>
                </Link>
                <PageLink href="OrganizationOnboarding">
                  <DropdownAnchor>
                    <Icon name="add" />
                    {intl.formatMessage(m.newOrganization)}
                  </DropdownAnchor>
                </PageLink>
              </>
            )}
            <hr className="my-1" />
            <Link href={Page.Home} passHref>
              <DropdownAnchor onClick={handleLogout}>
                <Icon name="exit_to_app" />
                {intl.formatMessage(m.logout)}
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
        <a id="toolbar-auth-button" href={Page.Login} className="nav-link">
          {intl.formatMessage(m.login)}
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
