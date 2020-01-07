import React, { useState } from 'react'
import GoogleMap, { GoogleMapProps } from './GoogleMap'
import styled from 'styled-components'
import Icon from '../Icon'
import { defineMessages, useIntl } from 'react-intl'

const Wrapper = styled.div`
  position: relative;
`

const Overlay = styled.button`
  background: #a3ccff;
  border: 0;
  cursor: pointer;

  .icon {
    color: #333;
    font-size: 64px;
  }
`

const GoogleMapStyled = styled(GoogleMap)`
  width: 100%;
  height: 100%;
`

const m = defineMessages({
  view: {
    id: 'BlockGoogleMap.view',
    defaultMessage: 'Clique para ver o mapa',
  },
})

interface BlockedGoogleMapProps extends GoogleMapProps {
  readonly className?: string
}

const BlockedGoogleMap: React.FC<BlockedGoogleMapProps> = ({
  className,
  ...props
}) => {
  const [enabled, setEnabled] = useState(false)
  const intl = useIntl()

  return (
    <Wrapper className={className}>
      {!enabled ? (
        <Overlay
          onClick={() => setEnabled(!enabled)}
          className="absolute left-0 border-0 right-0 top-0 bottom-0 btn--block mx-auto"
        >
          <Icon name="map" className="block mb-4" />
          <span className="font-medium rounded-full px-4 py-3 bg-white">
            {intl.formatMessage(m.view)}
          </span>
        </Overlay>
      ) : (
        <GoogleMapStyled className={className} {...props} />
      )}
    </Wrapper>
  )
}

BlockedGoogleMap.displayName = 'BlockedGoogleMap'

export default BlockedGoogleMap
