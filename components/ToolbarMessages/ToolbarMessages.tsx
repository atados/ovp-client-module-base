import React from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'

const Menu = styled(DropdownMenu)``

interface ToolbarMessagesProps {
  readonly open?: boolean
  readonly className?: string
}

interface ToolbarMessagesState {
  open: boolean
}

class ToolbarMessages extends React.Component<
  ToolbarMessagesProps,
  ToolbarMessagesState
> {
  public static defaultProps = {
    className: undefined,
  }
  public static getDerivedStateFromProps(
    props: ToolbarMessagesProps,
    state?: ToolbarMessagesState,
  ): ToolbarMessagesState {
    return {
      open: state ? state.open : props.open || false,
    }
  }

  constructor(props) {
    super(props)

    this.state = ToolbarMessages.getDerivedStateFromProps(props)
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
          Mensagens
        </button>
        <Menu>qwe</Menu>
      </Dropdown>
    )
  }
}

export default ToolbarMessages
