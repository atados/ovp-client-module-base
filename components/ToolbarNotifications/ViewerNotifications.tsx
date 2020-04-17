import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Notification from '~/components/Notification'
import { API } from '~/types/api'
import Link from 'next/link'
import { Page } from '~/common'

const Body = styled.div`
  top: 44px;
  overflow-y: auto;
`

const Header = styled.div`
  height: 44px;
`

interface ViewerNotificationsProps {
  readonly className?: string
  readonly notifications: API.Notification[]
}

const ViewerNotifications: React.FC<ViewerNotificationsProps> = ({
  className,
  notifications,
}) => {
  return (
    <div className={className}>
      <Header className="px-3 pt-3 pb-2 shadow-sm relative bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-lg mb-0">
            <FormattedMessage
              id="viewer.notifications.title"
              defaultMessage="Notificações"
            />
          </h4>
          <Link href={Page.Notifications}>
            <a>Ver todas</a>
          </Link>
        </div>
      </Header>
      <Body className="absolute bottom-0 left-0 right-0">
        <div className="shadow-sm">
          {notifications.map((notification: API.Notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
        {notifications.length === 0 && (
          <div className="p-5 text-center">
            <h4>
              <FormattedMessage
                id="viewer.notifications.empty"
                defaultMessage="Nenhuma notificação encontrada"
              />
            </h4>
          </div>
        )}
      </Body>
    </div>
  )
}

ViewerNotifications.displayName = 'Notifications'

export default ViewerNotifications
