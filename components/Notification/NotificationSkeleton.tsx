import React from 'react'
import Icon from '~/components/Icon'
import cx from 'classnames'
import { MaterialIconName } from '../Icon/Icon'
import moment from 'moment'

interface NotificationSkeletonProps {
  readonly className?: string
  readonly read: boolean
  readonly avatarImageURL: string
  readonly timestamp: string
  readonly indicatorBgClassName: string
  readonly indicatorIcon: MaterialIconName
  readonly children?: React.ReactNode
}

const NotificationSkeleton = React.forwardRef<
  HTMLAnchorElement,
  NotificationSkeletonProps
>(
  (
    {
      read,
      avatarImageURL,
      timestamp,
      indicatorBgClassName,
      indicatorIcon,
      className,
      children,
    },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        className={cx(
          'hover:bg-gray-200 text-gray-800 cursor-pointer block py-2 px-3',
          !read && 'bg-gray-200',
          className,
        )}
      >
        <div className="pl-16 pr-6">
          <div
            className={`h-3 w-3 rounded-full float-right -mr-6 mt-1 ${
              read ? `bg-gray-300` : `bg-primary-500`
            }`}
            role="presentation"
          />
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center relative -ml-16 float-left"
            style={
              avatarImageURL
                ? {
                    backgroundImage: `url('${avatarImageURL}')`,
                  }
                : { backgroundColor: '#c4c4c4' }
            }
          >
            <span
              className={cx(
                'w-5 h-5 absolute bottom-0 right-0 -mb-1 -mr-1 rounded-full border-2 text-center block leading-snug',
                indicatorBgClassName,
                read ? 'border-white' : 'border-gray-200',
              )}
            >
              <Icon name={indicatorIcon} className="text-white text-xs" />
            </span>
          </div>
          <div className="block">{children}</div>
          <abbr title={timestamp} className="text-gray-600 text-sm">
            {moment(timestamp).fromNow()}
          </abbr>
        </div>
      </a>
    )
  },
)

export default NotificationSkeleton
