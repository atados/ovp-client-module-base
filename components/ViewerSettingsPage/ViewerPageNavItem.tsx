import React from 'react'
import cx from 'classnames'
import Icon from '~/components/Icon'
import { MaterialIconName } from '../Icon/Icon'

interface ViewerPageNavItemProps {
  readonly icon: MaterialIconName
  readonly className?: string
}

const ViewerPageNavItem: React.FC<ViewerPageNavItemProps> = React.forwardRef<
  HTMLAnchorElement,
  ViewerPageNavItemProps
>(({ className, icon, children, ...props }) => {
  return (
    <a
      {...props}
      className={cx(
        'rounded-full hover:bg-gray-300 px-3 py-2 block leading-loose text-gray-800',
        className,
      )}
    >
      <Icon
        name={icon}
        className="bg-gray-300 rounded-full w-8 h-8 text-center mr-4 text-lg leading-relaxed"
      />
      {children}
    </a>
  )
})

ViewerPageNavItem.displayName = 'ViewerPageNavItem'

export default ViewerPageNavItem
