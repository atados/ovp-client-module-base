import React, { useState } from 'react'
import { Waypoint } from 'react-waypoint'

interface WaypointSectionProps {
  readonly className?: string
  readonly component?: any
  readonly waypointStyle?: React.CSSProperties
}

const WaypointSection: React.FC<WaypointSectionProps> = ({
  className,
  waypointStyle,
  component: Component,
}) => {
  const [reached, setReached] = useState(false)
  if (!reached) {
    return (
      <Waypoint onEnter={() => setReached(true)}>
        <div style={waypointStyle} />
      </Waypoint>
    )
  }
  return <Component className={className} />
}

WaypointSection.displayName = 'WaypointSection'

export default WaypointSection
