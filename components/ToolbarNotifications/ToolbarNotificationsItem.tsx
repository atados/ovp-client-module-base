import React from 'react'
import Icon from '~/components/Icon'

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

interface ToolbarNotificationItemProps {
  readonly className?: string
  readonly onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => any
  readonly onOpenApplication?: () => any
  readonly notification: Notification
}

const ToolbarNotificationItem: React.FC<ToolbarNotificationItemProps> = ({
  className,
  notification,
}) => {
  return (
    <div
      className={`${!notification.read &&
        `bg-gray-200`}${className} hover:bg-gray-200 cursor-pointer block p-2 px-4 flex flex-row`}
    >
      <div
        className="w-12 h-12 rounded-full border float-left bg-cover bg-center mr-4"
        style={
          notification?.image
            ? {
                backgroundImage: `url('${notification?.image?.image_medium_url}')`,
              }
            : { backgroundColor: '#c4c4c4' }
        }
      >
        <div className="flex justify-end items-end h-12">
          <div
            className={`${
              notification.type === 'Confirm'
                ? 'bg-green-500'
                : notification.type === 'Delete'
                ? 'bg-red-600'
                : notification.type === 'Alert'
                ? 'bg-green-500'
                : 'bg-orange-500'
            } w-5 h-5 rounded-full border-2 border-white flex justify-center items-center ${!notification.read &&
              `border-gray-200`}`}
          >
            <Icon
              name={
                notification.type === 'Confirm'
                  ? 'check'
                  : notification.type === 'Delete'
                  ? 'close'
                  : 'priority_high'
              }
              className="text-white"
            />
          </div>
        </div>
      </div>
      <div className=" flex-grow">
        {notification.type === 'Confirm' ? (
          <span
            className={`${
              className ? 'max-w-3xl' : 'max-w-sm'
            } text-base font-regular block`}
          >
            A ONG <strong>{notification.org}</strong> confirmou sua inscrição na
            vaga <strong>{notification.project}</strong>.
          </span>
        ) : notification.type === 'Delete' ? (
          <span
            className={`${
              className ? 'max-w-3xl' : 'max-w-sm'
            } text-base font-regular block`}
          >
            Sua inscrição na vaga <strong>{notification.project}</strong> da ONG{' '}
            <strong>{notification.org}</strong> foi removida.
          </span>
        ) : notification.type === 'Alert' ? (
          <span
            className={`${
              className ? 'max-w-3xl' : 'max-w-sm'
            } text-base font-regular block`}
          >
            Amanhã é o dia da ação <strong>{notification.project}</strong> da
            ONG <strong>{notification.org}</strong>.
          </span>
        ) : (
          <span
            className={`${
              className ? 'max-w-3xl' : 'max-w-sm'
            } text-base font-regular block`}
          >
            Sua ação <strong>{notification.project}</strong> recebeu uma nova
            inscrição.
          </span>
        )}
        <span className="text-gray-600 text-sm block mt-1">
          {notification.created_at}
        </span>
      </div>
      <div
        className={`h-3 w-3 rounded-full ${
          notification.read ? `bg-gray-300` : `bg-primary-500`
        }`}
      />
    </div>
  )
}

ToolbarNotificationItem.displayName = 'ToolbarNotificationItem'

export default React.memo(ToolbarNotificationItem)
