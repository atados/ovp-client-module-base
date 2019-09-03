import React from 'react'
import styled from 'styled-components'
import Icon from '../Icon'
import RouterSwitch from '../RouterSwitch'
import { channel } from '~/base/common/constants'

const Container = styled.div``
const Figure = styled.div`
  height: 300px;
  border-radius: 3px 3px 0 0;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.1);
`
const Body = styled.div`
  height: 160px;
  padding: 28px;
  text-align: center;
`

const Footer = styled.div`
  display: flex;
  border-top: 1px solid #eee;
  padding: 20px 24px;
  position: relative;

  button {
    position: relative;
    z-index: 2;
  }
`

const Indicators = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 10px;
  margin: auto;
  line-height: 1;
`

const Indicator = styled.span`
  vertical-align: top;
  display: inline-block;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  border-width: 0;
  margin: 0 5px;
  padding: 0;

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.4);
    outline: none;
  }

  &.active {
    background: ${channel.theme.color.primary[500]};
  }
`

interface Slide {
  id: string
  title: string
  description: string
  figureStyle: React.CSSProperties
}

interface TourProps {
  readonly className?: string
  readonly slides: Slide[]
  readonly onFinish: () => any
}

interface TourState {
  readonly slideId: string
}

class Tour extends React.Component<TourProps, TourState> {
  public static getDerivedStateFromProps(
    props: TourProps,
    state?: TourState,
  ): TourState {
    return {
      slideId: state ? state.slideId : props.slides[0].id,
    }
  }

  constructor(props) {
    super(props)

    this.state = Tour.getDerivedStateFromProps(props)
  }

  public renderSlide = ({ index }) => {
    const slide = this.props.slides[index]

    return (
      <>
        <Figure style={slide.figureStyle} />
        <Body>
          <h4 className="ts-large">{slide.title}</h4>
          <p className="tc-muted-dark">{slide.description}</p>
        </Body>
      </>
    )
  }

  public get currentSlideIndex() {
    const { slides } = this.props
    const { slideId } = this.state
    let slideIndex: number = -1

    slides.some((slide, i) => {
      if (slide.id === slideId) {
        slideIndex = i

        return true
      }

      return false
    })

    return slideIndex
  }

  public previous = () => {
    const { slides } = this.props
    const { currentSlideIndex } = this

    this.setState({ slideId: slides[currentSlideIndex - 1].id })
  }

  public next = () => {
    const { slides } = this.props
    const { currentSlideIndex } = this

    this.setState({ slideId: slides[currentSlideIndex + 1].id })
  }

  public render() {
    const { className, slides, onFinish } = this.props
    const { slideId } = this.state
    const firstSlide = slides[0]
    const lastSlide = slides[slides.length - 1]

    return (
      <Container className={className}>
        <RouterSwitch
          location={{ path: slideId }}
          disableBackButton
          routes={slides.map((slide, i) => ({
            path: slide.id,
            component: this.renderSlide,
            props: {
              index: i,
            },
          }))}
        />
        <Footer>
          {firstSlide && firstSlide.id !== slideId && (
            <button
              type="button"
              className="btn btn-text tc-link"
              onClick={this.previous}
            >
              {' '}
              <Icon name="arrow_back" className="mr-2" />
              Anterior
            </button>
          )}
          <Indicators>
            {slides.map(slide => (
              <Indicator
                key={slide.id}
                className={slide.id === slideId ? 'active' : undefined}
              />
            ))}
          </Indicators>
          <div className="mr-auto" />
          {lastSlide && slideId !== lastSlide.id && (
            <button
              type="button"
              className="btn btn-text tc-link"
              onClick={this.next}
            >
              Proxima <Icon name="arrow_forward" className="ml-1" />
            </button>
          )}
          {lastSlide && slideId === lastSlide.id && (
            <button
              type="button"
              className="btn btn-text tc-link"
              onClick={onFinish}
            >
              Concluir <Icon name="check" className="ml-1" />
            </button>
          )}
        </Footer>
      </Container>
    )
  }
}

export default Tour
