import React from 'react'
import Icon from '~/components/Icon'
import { MaterialIconName } from '../Icon/Icon'

interface NotificationMessageProps {
  readonly className?: string
  readonly notificationWasRead: boolean
  readonly avatarImageURL: string
  readonly timestamp: string
  readonly indicatorBgClassName: string
  readonly indicatorIcon: MaterialIconName
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({
  notificationWasRead,
  avatarImageURL,
  timestamp,
  indicatorBgClassName,
  indicatorIcon,
  className,
  children,
}) => {
  console.log(indicatorIcon)
  return (
    <div
      className={`${!notificationWasRead &&
        `bg-gray-200`}${className} hover:bg-gray-200 cursor-pointer block p-2 px-4 flex flex-row`}
    >
      <div
        className="w-12 h-12 rounded-full border float-left bg-cover bg-center mr-4"
        style={
          avatarImageURL
            ? {
                backgroundImage: `url('${avatarImageURL}')`,
              }
            : { backgroundColor: '#c4c4c4' }
        }
      >
        <div className="flex justify-end items-end h-12">
          <div
            className={`${indicatorBgClassName} w-5 h-5 -mb-1 rounded-full border-2 border-white flex justify-center items-center 
          ${!notificationWasRead && `border-gray-200`}`}
          >
            <Icon name={indicatorIcon} className="text-white text-xs" />
          </div>
        </div>
      </div>
      <div className=" flex-grow">
        <span
          className={`${
            className ? 'max-w-3xl' : 'max-w-sm'
          } text-base font-regular block`}
        >
          {children}
        </span>
        <span className="text-gray-600 text-sm block mt-1">{timestamp}</span>
      </div>
      <div
        className={`h-3 w-3 rounded-full ${
          notificationWasRead ? `bg-gray-300` : `bg-primary-500`
        }`}
      />
    </div>
  )
}

export default NotificationMessage
