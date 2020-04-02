import React from 'react'
import Icon from '~/components/Icon'
import cx from 'classnames'
import { MaterialIconName } from '../Icon/Icon'

interface NotificationMessageProps {
  readonly className?: string
  readonly read: boolean
  readonly avatarImageURL: string
  readonly timestamp: string
  readonly indicatorBgClassName: string
  readonly indicatorIcon: MaterialIconName
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({
  read,
  avatarImageURL,
  timestamp,
  indicatorBgClassName,
  indicatorIcon,
  className,
  children,
}) => {
  return (
    <div
      className={cx(
        'hover:bg-gray-200 cursor-pointer block p-2 px-4 flex flex-row',
        !read && 'bg-gray-200',
        className,
      )}
    >
      <div
        className="w-12 h-12 rounded-full border pr-10 float-left bg-cover bg-center mr-2"
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
            className={cx(
              'w-5 h-5 -mb-1 -mr-10 rounded-full border-2 border-white flex justify-center items-center',
              indicatorBgClassName,
              !read && `border-gray-200`,
            )}
          >
            <Icon name={indicatorIcon} className="text-white text-xs" />
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <span className="text-base font-regular block">{children}</span>
        <span className="text-gray-600 text-sm block mt-1">{timestamp}</span>
      </div>
      <div
        className={`h-3 w-3 rounded-full px-1 ${
          read ? `bg-gray-300` : `bg-primary-500`
        }`}
      />
    </div>
  )
}

export default NotificationMessage
