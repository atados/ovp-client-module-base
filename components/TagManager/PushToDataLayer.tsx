import React from 'react'
import { DataLayerMessage, pushToDataLayer } from '~/lib/tag-manager'

interface PushToDataLayerProps {
  readonly onClick?: DataLayerMessage
  readonly onMouseEnter?: DataLayerMessage
  readonly onMouseLeave?: DataLayerMessage
  readonly children: React.ReactNode
}

const PushToDataLayer: React.FC<PushToDataLayerProps> = ({
  children,
  ...props
}) => {
  const newProps = {}

  Object.keys(props).forEach(key => {
    newProps[key] = () => pushToDataLayer(props[key])
  })

  return React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    newProps,
  )
}

PushToDataLayer.displayName = 'PushToDataLayer'

export default PushToDataLayer
