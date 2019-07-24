import React from 'react'
import styled, { StyledProps } from 'styled-components'
import { CarouselContext, Direction } from '~/components/Carousel/Carousel'

interface SlideProps {
  readonly delaying: boolean
  readonly isActive: boolean
  readonly isPrev: boolean
  readonly isNext: boolean
  readonly direction: Direction
  readonly transitionTime?: number
}

const Slide = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: none;
  align-items: center;
  backface-visibility: hidden;
  perspective: 1000px;

  ${({
    delaying,
    isActive,
    direction,
    isPrev,
    isNext,
    transitionTime = 600,
  }: StyledProps<SlideProps>) => {
    let css: string = ''

    if (isActive || isNext || isPrev) {
      css += `
        transition: transform ${transitionTime}ms ease
      `
    }

    if (isActive) {
      css += `
        display: block;
      `
    }

    if (isNext || isPrev) {
      css += `
        display: block;
        position: absolute;
        top: 0;
      `
    }

    if (
      (isNext && delaying && direction === 'left') ||
      (isPrev && !delaying && direction === 'right')
    ) {
      css += `
        transform: translateX(-100%);
        transform: translate3d(-100%, 0, 0);
      `
    }

    if (
      (isPrev && !delaying && direction === 'left') ||
      (isNext && delaying && direction === 'right')
    ) {
      css += `
        transform: translateX(100%);
        transform: translate3d(100%, 0, 0);
      `
    }

    if (isNext && !delaying) {
      css += `
        transform: translateX(0%);
        transform: translate3d(0%, 0, 0);
      `
    }

    return css
  }};
`

const SlideInner = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export interface CarouselItemProps {
  readonly id: string
  readonly className?: string
  readonly children?: React.ReactNode
  readonly style?: React.CSSProperties
}

export interface CarouselItemType extends React.FC<CarouselItemProps> {
  isCarouselItem?: boolean
}

const CarouselItemWrapper: CarouselItemType = ({
  id,
  style,
  children,
  className,
}) => (
  <CarouselContext.Consumer>
    {({ transitionTime, delaying, currentItemId, prevItemId, direction }) => (
      <Slide
        className={className}
        isActive={currentItemId === id}
        isPrev={prevItemId === id}
        isNext={prevItemId ? currentItemId === id : false}
        direction={direction}
        delaying={delaying}
        transitionTime={transitionTime}
        style={style}
      >
        <SlideInner>{children}</SlideInner>
      </Slide>
    )}
  </CarouselContext.Consumer>
)

CarouselItemWrapper.isCarouselItem = true

export default CarouselItemWrapper
