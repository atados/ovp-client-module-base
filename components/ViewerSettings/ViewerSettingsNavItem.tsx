import React from 'react'
import cx from 'classnames'
import Icon from '~/components/Icon'
import { MaterialIconName } from '../Icon/Icon'

interface ViewerPageNavItemProps {
  readonly icon: MaterialIconName
  readonly className?: string
  readonly active?: boolean
}

const ViewerSettingsNavItem: React.FC<
  ViewerPageNavItemProps
> = React.forwardRef<HTMLAnchorElement, ViewerPageNavItemProps>(
  ({ className, icon, children, active, ...props }) => {
    return (
      <a
        {...props}
        className={cx(
          'rounded-full px-2 py-1 block leading-loose tc-gray-800',
          active ? 'tc-primary-500' : 'hover:bg-gray-300',
          className,
        )}
      >
        <Icon
          name={icon}
          className={cx(
            'rounded-full w-8 h-8 ta-center mr-3 text-lg leading-relaxed',
            active ? 'bg-primary-500 tc-white' : 'bg-gray-300',
          )}
        />
        {children}
      </a>
    )
  },
)

ViewerSettingsNavItem.displayName = 'ViewerPageNavItem'

export default ViewerSettingsNavItem
