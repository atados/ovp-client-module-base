import React from 'react'
import styled from 'styled-components'
import { Color, Theme } from '~/base/common'

const Container = styled.div`
  height: 3px;
`

const Value = styled.div`
  height: 100%;
  background: ${Theme.progressBarColor || Color.secondary[500]};
  transition: width 0.4s ease-in-out, opacity 0.2s ease-in-out;
`

interface ProgressBarProps {
  readonly className?: string
}

interface ProgressBarState {
  value: number
  starting: boolean
  hidden: boolean
}

class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {
  private timeout: number
  private umounted?: boolean

  constructor(props) {
    super(props)

    this.state = {
      starting: false,
      hidden: true,
      value: 0,
    }
  }

  public componentWillUnmount() {
    this.umounted = true
    clearTimeout(this.timeout)
  }

  public start = (): void => {
    if (this.umounted) {
      return
    }

    this.setState({ value: 0, starting: true, hidden: false }, () => {
      this.timeout = window.setTimeout(() => {
        this.setState({ starting: false, value: 20 }, () => {
          this.timeout = window.setTimeout(() => {
            this.setState({ value: 50 }, () => {
              this.timeout = window.setTimeout(() => {
                this.setState({ value: 80 })
              }, 1000)
            })
          }, 500)
        })
      }, 20)
    })
  }

  public done = (): void => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.setState({ starting: false, value: 100 }, () => {
      this.timeout = window.setTimeout(() => {
        this.setState({ hidden: true })
      }, 100)
    })
  }

  public render() {
    const { className } = this.props
    const { hidden, starting, value } = this.state

    return (
      <Container className={className}>
        <Value
          style={{
            width: `${value}%`,
            transition: starting ? 'opacity .2s ease-in-out' : undefined,
            opacity: hidden ? 0 : 1,
          }}
        />
      </Container>
    )
  }
}

export default ProgressBar
