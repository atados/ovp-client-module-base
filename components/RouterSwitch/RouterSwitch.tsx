import isEqual from 'fast-deep-equal'
import * as React from 'react'
import styled from 'styled-components'
import { keyframes } from 'styled-components'
import Icon from '~/components/Icon'

export const fadeUp = keyframes`
  0% {
    opacity: 0;
    top: -30px;
  }

  100% {
    top: 0;
    opacity: 1;
  }
`

export const Transition = {
  FadeUp: 'fade-up',
}
type TransitionType = 'fade-up'

const Body = styled.div``
const Container = styled.div`
  position: relative;
  transition: height 300ms ease-in-out;

  &.transitioning {
    overflow: hidden;
  }

  &.transition-fade-up {
    &.transitioning ${Body} {
      position: relative;
    }

    ${Body} {
      animation: ${fadeUp} 300ms ease-in-out 0s 1 normal;
    }
  }
`

const BackButton = styled.button`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 4px;
  font-size: 24px;
  position: absolute;
  top: 12px;
  left: 12px;
`

export interface RouterSwitchContextType {
  location: Location
  push?: (newLocation: Location) => void
}

export const RouterSwitchContext = React.createContext<RouterSwitchContextType>(
  {
    location: { path: '/' },
  },
)

interface Route<T> {
  path: string
  component: React.ComponentType<T>
  props?: Partial<T>
}

export interface Location {
  path: string
  props?: object
}

export type OnLocationChangeCallback = (newLocation: Location) => void

interface RouterSwitchProps {
  readonly routes: Array<Route<any>>
  readonly location?: Location
  readonly defaultPath?: string
  readonly onLocationChange?: OnLocationChangeCallback
  readonly className?: string
  readonly transition?: TransitionType
  readonly transitionTime?: number
  readonly disableBackButton?: boolean
}

interface RouterSwitchState {
  readonly location: Location
  readonly history: Location[]
  readonly offsetHeight?: number
  readonly transitioning?: boolean
}

class RouterSwitch extends React.Component<
  RouterSwitchProps,
  RouterSwitchState
> {
  public static defaultProps = {
    transitionTime: 300,
    className: undefined,
  }
  public static getDerivedStateFromProps(
    props: RouterSwitchProps,
    state?: RouterSwitchState,
  ): RouterSwitchState {
    let location = state
      ? state.location
      : props.location || { path: props.defaultPath || '/' }
    const history = state ? state.history : []
    if (state && props.location) {
      if (!isEqual(props.location, state.location)) {
        history.push(state.location)
      }
      location = props.location
    }

    return {
      location,
      history,
    }
  }
  public transitionTimeout?: number
  public body: HTMLDivElement | null

  constructor(props) {
    super(props)

    this.state = RouterSwitch.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    if (this.body) {
      this.setState({ offsetHeight: this.body.offsetHeight })
    }
  }

  public componentDidUpdate(_, prevState: RouterSwitchState) {
    const { transition, transitionTime } = this.props
    const { transitioning } = this.state

    if (
      this.body &&
      transitioning &&
      transition &&
      prevState.location !== this.state.location
    ) {
      clearTimeout(this.transitionTimeout)

      this.setState({ offsetHeight: this.body.offsetHeight }, () => {
        this.transitionTimeout = window.setTimeout(() => {
          this.setState({
            transitioning: false,
          })
        }, transitionTime)
      })
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.transitionTimeout)
  }

  public push = (location: Location): void => {
    const { transition, location: fixedLocation, onLocationChange } = this.props
    const { history } = this.state

    if (onLocationChange) {
      onLocationChange(location)
    }

    if (!fixedLocation) {
      this.setState({
        location,
        transitioning: !!transition,
        history: [...history, this.state.location],
      })
    }
  }

  public back = () => {
    const { location: fixedLocation, transition, onLocationChange } = this.props
    const { history } = this.state
    const newHistory = [...history]
    const location = newHistory.pop()

    if (location) {
      if (onLocationChange) {
        onLocationChange(location)
      }

      if (!fixedLocation) {
        this.setState({
          location,
          transitioning: !!transition,
          history: newHistory,
        })
      }
    }
  }

  public render() {
    const { className, transition, disableBackButton, routes } = this.props
    const { history, location, transitioning, offsetHeight } = this.state

    return (
      <RouterSwitchContext.Provider
        value={{
          location,
          push: this.push,
        }}
      >
        <Container
          className={`${className ? `${className} ` : ''}${
            transition ? `transition-${transition}` : ''
          }${transitioning ? ` transitioning` : ''}`}
          style={transitioning ? { height: `${offsetHeight}px` } : undefined}
        >
          <Body
            key={location.path}
            ref={ref => {
              this.body = ref
            }}
          >
            {!disableBackButton && history.length >= 1 && (
              <BackButton
                title="Voltar"
                className="btn btn-text"
                onClick={this.back}
              >
                <Icon name="arrow_back" />
              </BackButton>
            )}
            {routes.map((route, i) =>
              route.path === location.path ? (
                <route.component
                  key={`${route.path}${i}`}
                  {...route.props}
                  {...location.props}
                />
              ) : null,
            )}
          </Body>
        </Container>
      </RouterSwitchContext.Provider>
    )
  }
}

export default RouterSwitch
