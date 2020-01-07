import React from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'

const Menu = styled(DropdownMenu)``

interface ToolbarTimelineProps {
  readonly open?: boolean
  readonly className?: string
}

interface ToolbarTimelineState {
  open: boolean
}

class ToolbarTimeline extends React.Component<
  ToolbarTimelineProps,
  ToolbarTimelineState
> {
  public static defaultProps = {
    className: undefined,
  }
  public static getDerivedStateFromProps(
    props: ToolbarTimelineProps,
    state?: ToolbarTimelineState,
  ): ToolbarTimelineState {
    return {
      open: state ? state.open : props.open || false,
    }
  }

  constructor(props) {
    super(props)

    this.state = ToolbarTimeline.getDerivedStateFromProps(props)
  }

  public handleOpenStateChange = (open: boolean) => {
    this.setState({
      open,
    })
  }

  public handleButtonClick = () => this.setState({ open: !this.state.open })

  public render() {
    const { open } = this.state

    return (
      <Dropdown open={open} onOpenStateChange={this.handleOpenStateChange}>
        <button
          className="btn btn-plain-text nav-link font-normal"
          onClick={this.handleButtonClick}
        >
          Inscrições
        </button>
        <Menu>qwe</Menu>
      </Dropdown>
    )
  }
}

export default ToolbarTimeline
