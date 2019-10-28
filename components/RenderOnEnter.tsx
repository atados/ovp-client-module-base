import React, { useState } from 'react'
import { Waypoint } from 'react-waypoint'

interface RenderOnEnterProps {
  readonly className?: string
  readonly component?: any
  readonly componentProps?: any
  readonly waypointStyle?: React.CSSProperties
}

const RenderOnEnter: React.FC<RenderOnEnterProps> = ({
  className,
  waypointStyle,
  component: Component,
  componentProps,
}) => {
  const [reached, setReached] = useState(false)
  if (!reached) {
    return (
      <Waypoint onEnter={() => setReached(true)}>
        <div style={waypointStyle} />
      </Waypoint>
    )
  }
  return <Component className={className} {...componentProps} />
}

RenderOnEnter.displayName = 'RenderOnEnter'

export default RenderOnEnter
