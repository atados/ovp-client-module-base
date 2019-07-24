import * as React from 'react'

export interface IconProps {
  /**
   * Icon's name
   */
  name: string
  className?: string
  style?: React.CSSProperties
}

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  className,
  ...props
}) => (
  <span className={`icon im${className ? ` ${className}` : ''}`} {...props}>
    {name}
  </span>
)
Icon.displayName = 'Icon'

export default Icon
