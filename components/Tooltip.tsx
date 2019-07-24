import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  min-height: 28px;
  font-size: 13px;
  color: #fff;
  padding: 6px 10px;
  background: #224;
  z-index: 1000;
  border-radius: 6px;

  &::after {
    content: '';
    border-width: 6px 6px 0;
    border-color: #224 rgba(0, 0, 0, 0);
    border-style: solid;
    width: 0;
    height: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    margin: auto;
    display: block;
  }
`

interface TooltipProps {
  readonly value: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ value, children }) => {
  const timeoutRef = useRef<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const componentRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState({ enabled: false, top: 0, left: 0 })

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      return
    }

    setState({
      enabled: true,
      top: -1000,
      left: -1000,
    })

    setTimeout(() => {
      if (tooltipRef.current && componentRef.current) {
        const rect = componentRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()

        setState({
          enabled: true,
          top: window.scrollY + rect.top - tooltipRect.height,
          left:
            window.scrollX - tooltipRect.width / 2 + rect.left + rect.width / 2,
        })
      }
    }, 10)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setState(prevState => ({ ...prevState, enabled: false }))
      timeoutRef.current = null
    }, 100)
  }

  return (
    <>
      {state.enabled &&
        createPortal(
          <Wrapper
            ref={tooltipRef}
            style={{ top: state.top, left: state.left }}
          >
            {value}
          </Wrapper>,
          document.body,
        )}
      {React.cloneElement(React.Children.only(children) as React.ReactElement, {
        ref: componentRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
    </>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
