import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Notification from '~/components/Notification'

const Body = styled.div`
  top: 50px;
  overflow-y: auto;
`

const Header = styled.div`
  height: 50px;
  padding-top: 14px;
  padding-bottom: 14px;
`

interface Notification {
  id: number
  read: boolean
  type: string
  project: string
  org: string
  image: {
    image_medium_url: string
  }
  created_at: string
}

interface NotificationsProps {
  readonly className?: string
  readonly scroll?: boolean
  handleMarkAsRead(id: number): void
  readonly notifications: Notification[]
}

const Notifications: React.FC<NotificationsProps> = ({
  className,
  handleMarkAsRead,
  notifications,
  scroll = true,
}) => {
  return (
    <div className={className}>
      <Header className="px-3 shadow-sm relative bg-white rounded-t-lg shadow">
        <div className="flex items-center justify-between">
          <h4 className="text-lg mb-0">
            <FormattedMessage
              id="toolbarApplications.title"
              defaultMessage="Notificações"
            />
          </h4>
          <a href="/notificacoes">Ver todas</a>
        </div>
      </Header>
      <Body className={scroll ? 'absolute bottom-0 left-0 right-0' : ''}>
        <div className="shadow-sm">
          {notifications.map((notification: Notification) => (
            <button
              type="button"
              className={`${
                notification.read === false ? 'bg-gray-200' : null
              } text-left w-full outline-none`}
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <Notification notification={notification} />
            </button>
          ))}
        </div>
        {notifications.length === 0 && (
          <div className="p-5 text-center">
            <h4>
              <FormattedMessage
                id="toolbarApplications.noApplicationsFound.title"
                defaultMessage="Nenhuma notificação encontrada"
              />
            </h4>
          </div>
        )}
      </Body>
    </div>
  )
}

Notifications.displayName = 'Notifications'

export default Notifications
