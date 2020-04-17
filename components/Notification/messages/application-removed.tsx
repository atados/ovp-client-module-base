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

const NotificationApplicationRemoved: React.FC<NotificationApplicationProps> = ({
  notification,
  className,
}) => {
  return (
    <NotificationSkeleton
      read={notification.read}
      className={className}
      avatarImageURL={notification.image.image_medium_url}
      timestamp={notification.created_at}
      indicatorBgClassName={'bg-red-500'}
      indicatorIcon={'close'}
    >
      Sua inscrição na vaga <strong>{notification.project}</strong> da ONG{' '}
      <strong>{notification.org}</strong> foi removida.
    </NotificationSkeleton>
  )
}

export default NotificationApplicationRemoved
