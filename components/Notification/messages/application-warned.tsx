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
      read={notification.read}
      className={className}
      avatarImageURL={notification.image.image_medium_url}
      timestamp={notification.created_at}
      indicatorBgClassName={'bg-orange-500'}
      indicatorIcon={'priority_high'}
    >
      Sua ação <strong>{notification.project}</strong> recebeu uma nova
      inscrição.
    </NotificationSkeleton>
  )
}

export default NotificationApplicationConfirmed
