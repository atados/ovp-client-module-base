import React from 'react'
import styled from 'styled-components'
import { CarouselItemType } from '~/components/Carousel/CarouselItem'

export interface Monitor {
  readonly id: string
  readonly unregister: () => void
}

export type Direction = 'left' | 'right' | 'top' | 'bottom'

export interface CarouselContextType {
  readonly delaying: boolean
  readonly transitionTime?: number
  readonly currentItemId?: string
  readonly prevItemId?: string
  readonly direction: Direction
  readonly slides: string[]
  readonly setCurrentItemId?: (
    id: string,
    direction?: Direction,
    restartInterval?: boolean,
  ) => void
}

export interface CarouselProps {
  readonly style?: React.CSSProperties
  readonly transitionTime?: number
  readonly rotateEach?: number
  readonly className?: string
  readonly itemId?: string
  readonly defaultItemId?: string
  readonly children: React.ReactNode
  readonly onChange?: (itemId: string, direction: Direction) => void
}

interface CarouselState {
  readonly slides: string[]
  readonly currentItemId: string
  readonly direction: Direction
  readonly prevItemId?: string
  readonly delaying: boolean
}

export const CarouselContext = React.createContext<CarouselContextType>({
  direction: 'right',
  delaying: false,
  slides: [],
})

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`

class Carousel extends React.Component<CarouselProps, CarouselState> {
  public static defaultProps = {
    transitionTime: 600,
    rotateEach: undefined,
  }

  public static getDerivedStateFromProps(
    props: CarouselProps,
    state,
  ): CarouselState {
    const slides: string[] = []
    React.Children.forEach(props.children, (child: any) => {
      if (
        child &&
        typeof child === 'object' &&
        (child.type as CarouselItemType).isCarouselItem
      ) {
        slides.push(child.props.id)
      }
    })

    return {
      slides,
      currentItemId: props.itemId
        ? props.itemId
        : state
        ? state.currentItemId
        : props.defaultItemId || slides[0],
      direction: state ? state.direction : 'right',
      delaying: state ? state.delaying : false,
    }
  }

  public static filterChildren = (kind: string) => {
    if (kind === 'CarouselItem' || kind === 'CarouselIndicators') {
      return true
    }

    return false
  }

  public static filterParent = (kind: string) => {
    if (kind !== 'Carousel') {
      return true
    }

    return false
  }
  public rotateInterval?: number
  public rotateIntervalTime?: number

  constructor(props) {
    super(props)

    this.state = Carousel.getDerivedStateFromProps(props, null)
  }

  public componentDidMount() {
    this.updateRotateInterval()
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.rotateEach !== this.props.rotateEach) {
      this.updateRotateInterval()
    }
  }

  public componentWillUnmount() {
    if (this.rotateInterval) {
      clearInterval(this.rotateInterval)
    }
  }

  public updateRotateInterval = (forceRestart?: boolean) => {
    const { rotateEach } = this.props

    if (rotateEach !== this.rotateIntervalTime || forceRestart) {
      this.rotateIntervalTime = rotateEach

      if ((!rotateEach || forceRestart) && this.rotateInterval) {
        clearInterval(this.rotateInterval)
      }

      if (rotateEach) {
        this.rotateInterval = window.setInterval(() => {
          this.next()
        }, rotateEach)
      }
    }
  }

  public previous = () => {
    const { slides, currentItemId } = this.state
    const index = slides.indexOf(currentItemId)
    this.setCurrentItemId(
      index === 0 ? slides[slides.length - 1] : slides[index - 1],
      'left',
    )
  }

  public next = () => {
    const { slides, currentItemId } = this.state
    const index = slides.indexOf(currentItemId)
    this.setCurrentItemId(
      slides.length - 1 === index ? slides[0] : slides[index + 1],
      'right',
    )
  }

  public setCurrentItemId = (
    id,
    forceDirection?: Direction,
    restartInterval?: boolean,
  ) => {
    if (this.state.prevItemId || id === this.state.currentItemId) {
      return
    }

    if (restartInterval) {
      this.updateRotateInterval(true)
    }

    let direction: Direction | undefined = forceDirection

    if (!direction) {
      const { currentItemId, slides } = this.state
      const currentIndex = slides.indexOf(currentItemId)
      const nextIndex = slides.indexOf(id)
      direction = nextIndex > currentIndex ? 'right' : 'left'
    }

    const { onChange, transitionTime } = this.props
    if (onChange) {
      onChange(id, direction)
    }

    this.setState(
      {
        direction,
        prevItemId: this.state.currentItemId,
        currentItemId: id,
        delaying: true,
      },
      () => {
        setTimeout(() => {
          this.setState({ delaying: false })
          setTimeout(() => {
            this.setState({ prevItemId: undefined })
          }, transitionTime)
        }, 50)
      },
    )
  }

  public render() {
    const { setCurrentItemId } = this
    const { className, style, children, transitionTime } = this.props
    const {
      direction,
      slides,
      delaying,
      prevItemId,
      currentItemId,
    } = this.state

    return (
      <CarouselContext.Provider
        value={{
          slides,
          delaying,
          direction,
          currentItemId,
          prevItemId,
          setCurrentItemId,
          transitionTime,
        }}
      >
        <Wrapper className={className} style={style}>
          {children}
        </Wrapper>
      </CarouselContext.Provider>
    )
  }
}

export default Carousel
