import * as React from 'react'
import styled from 'styled-components'
import { CarouselContext } from '~/components/Carousel/Carousel'

const Indicators = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 20;
`

const Indicator = styled.button`
  display: inline-block;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  border-width: 0;
  margin: 0 5px;
  padding: 0;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.7);
    outline: none;
  }

  &.active {
    background: #fff;
  }
`

export interface CarouselIndicatorsProps {
  readonly itemClassName?: string
  readonly className?: string
}

const CarouselIndicators: React.SFC<CarouselIndicatorsProps> = ({
  className,
  itemClassName,
}) => (
  <CarouselContext.Consumer>
    {({ currentItemId, setCurrentItemId, slides }) => (
      <Indicators className={className}>
        {slides.map(id => (
          <Indicator
            key={id}
            className={`${
              currentItemId === id ? 'active' : ''
            } ${itemClassName}`}
            onClick={
              setCurrentItemId
                ? () => setCurrentItemId(id, undefined, true)
                : undefined
            }
          />
        ))}
      </Indicators>
    )}
  </CarouselContext.Consumer>
)

CarouselIndicators.defaultProps = {
  itemClassName: '',
}

export default CarouselIndicators
