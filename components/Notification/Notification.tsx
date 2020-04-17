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
  readonly notification: Notification
}

const Notification: React.FC<NotificationProps> = ({
  className,
  notification,
}) => {
  if (notification.type === 'Confirm') {
    return (
      <NotificationApplicationConfirmed
        notification={notification}
        className={className}
      />
    )
  }
  if (notification.type === 'Delete') {
    return (
      <NotificationApplicationRemoved
        notification={notification}
        className={className}
      />
    )
  }
  if (notification.type === 'Alert') {
    return (
      <NotificationApplicationAlerted
        notification={notification}
        className={className}
      />
    )
  }
  if (notification.type === 'Warn') {
    return (
      <NotificationApplicationWarned
        notification={notification}
        className={className}
      />
    )
  } else {
    return null
  }
}

Notification.displayName = 'Notification'

export default React.memo(Notification)
