import React from 'react'
import NotificationApplicationConfirmed from './messages/application-confirmed'
import NotificationApplicationRemoved from './messages/application-removed'
import NotificationApplicationAlerted from './messages/application-alerted'
import NotificationApplicationWarned from './messages/application-warned'

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

interface NotificationProps {
  readonly className?: string
  readonly onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => any
  readonly onOpenApplication?: () => any
  readonly notification: Notification
}

const Notification: React.FC<NotificationProps> = ({
  className,
  notification,
}) => {
  return (
    <>
      {notification.type === 'Confirm' && (
        <NotificationApplicationConfirmed
          notification={notification}
          className={className}
        />
      )}
      {notification.type === 'Delete' && (
        <NotificationApplicationRemoved
          notification={notification}
          className={className}
        />
      )}
      {notification.type === 'Alert' && (
        <NotificationApplicationAlerted
          notification={notification}
          className={className}
        />
      )}
      {notification.type === 'Warn' && (
        <NotificationApplicationWarned
          notification={notification}
          className={className}
        />
      )}
    </>
  )
}

Notification.displayName = 'Notification'

export default React.memo(Notification)
