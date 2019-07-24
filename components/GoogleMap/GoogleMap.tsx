import BaseGoogleMap from 'google-map-react'
import * as React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import Status, { StatusLevel } from '~/components/Status'

export interface Mark {
  id?: string
  lat: number
  lng: number
}

export interface MarginBounds {
  ne: Mark
  nw: Mark
  se: Mark
  sw: Mark
}

export function isVisibleInBounds(mark: Mark, rect: MarginBounds) {
  return (
    mark.lat <= rect.nw.lat &&
    mark.lat >= rect.sw.lat &&
    mark.lng <= rect.se.lng &&
    mark.lng >= rect.sw.lng
  )
}

const Container = styled.div`
  background-color: #a3ccff;
`

export interface GoogleMapPosition {
  readonly center: Mark
  readonly marginBounds: MarginBounds
  readonly zoom: number
}

interface GoogleMapProps {
  readonly className?: string
  readonly disableChildrenMaping?: boolean
  readonly center?: Mark
  readonly defaultCenter?: Mark
  readonly defaultZoom?: number
  readonly onChange?: (newValue: GoogleMapPosition) => any
}

interface GoogleMapState {
  readonly center?: Mark
  readonly marginBounds?: MarginBounds
  readonly disableDoubleClickZoom?: boolean
}

class GoogleMap extends React.Component<GoogleMapProps, GoogleMapState> {
  public static defaultProps = {
    defaultZoom: 18,
  }

  public static getDerivedStateFromProps(
    props: GoogleMapProps,
    state?: GoogleMapState,
  ): GoogleMapState {
    return {
      center: state ? state.center : props.center || props.defaultCenter,
    }
  }
  public map: BaseGoogleMap | null

  constructor(props) {
    super(props)

    this.state = GoogleMap.getDerivedStateFromProps(props)
  }

  public redraw = () => {
    if (this.map) {
      this.map._mapDomResizeCallback()
    }
  }

  public handleChange = (position: GoogleMapPosition) => {
    this.setState({
      center: position.center,
      marginBounds: position.marginBounds,
    })

    if (this.props.onChange) {
      this.props.onChange(position)
    }
  }

  public handleMouseEnter = () => {
    if (!this.state.disableDoubleClickZoom) {
      this.setState({ disableDoubleClickZoom: true })
    }
  }

  public handleMouseLeave = () => {
    if (this.state.disableDoubleClickZoom) {
      this.setState({ disableDoubleClickZoom: false })
    }
  }

  public setCenter = (center: Mark) => {
    this.setState({ center })
  }

  public render() {
    const {
      className,
      defaultZoom,
      children,
      disableChildrenMaping,
    } = this.props
    const { center, disableDoubleClickZoom } = this.state

    if (!channel.config.maps.key) {
      return (
        <Container className={className}>
          <Status
            level={StatusLevel.Error}
            message="Google Maps used without API KEY"
          />
        </Container>
      )
    }

    return (
      <Container className={className}>
        <BaseGoogleMap
          ref={element => {
            this.map = element
          }}
          center={center}
          defaultZoom={defaultZoom}
          onChange={this.handleChange}
          options={{ disableDoubleClickZoom }}
        >
          {disableChildrenMaping
            ? children
            : React.Children.map(children, (child: React.ReactElement<any>) =>
                React.cloneElement(child, {
                  onRecenterMap: this.setCenter,
                  onMouseEnter: this.handleMouseEnter,
                  onMouseLeave: this.handleMouseLeave,
                }),
              )}
        </BaseGoogleMap>
      </Container>
    )
  }
}

export default GoogleMap
