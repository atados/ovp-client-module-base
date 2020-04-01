import React from 'react'
import NotificationSkeleton from '../NotificationSkeleton'

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

interface NotificationApplicationProps {
  readonly className?: string
  readonly notification: Notification
}

const NotificationApplicationConfirmed: React.FC<NotificationApplicationProps> = ({
  notification,
  className,
}) => {
  return (
    <NotificationSkeleton
      notificationWasRead={notification.read}
      className={className}
      avatarImageURL={notification.image.image_medium_url}
      timestamp={notification.created_at}
      indicatorBgClassName={'bg-green-500'}
      indicatorIcon={'check'}
    >
      A ONG <strong>{notification.org}</strong> confirmou sua inscrição na vaga{' '}
      <strong>{notification.project}</strong>.
    </NotificationSkeleton>
  )
}

export default NotificationApplicationConfirmed
