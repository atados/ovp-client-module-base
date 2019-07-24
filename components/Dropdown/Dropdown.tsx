import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

export enum DropdownDirection {
  UP,
  DOWN,
}

export const DropdownMenu = styled.div.attrs({
  className: 'dropdown-menu shadow-xl',
})`
  background: #fff;
  border-radius: 10px;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  z-index: 9;
  display: none;
`

const Container = styled.div`
  position: relative;

  .dropdownArrow {
    transition: transform 0.2s;
  }

  &.open {
    .dropdown-menu {
      display: block;
    }

    .dropdownArrow {
      transform: rotate(180deg);
    }
  }

  &.dropdown-direction-up.open .dropdown-menu {
    bottom: 100%;
    margin-top: -10px;
  }
`

export interface DropdownProps {
  readonly open?: boolean
  readonly defaultOpen?: boolean
  readonly onOpenStateChange?: (open: boolean) => void
  readonly closeOnOutClick?: boolean
  readonly direction?: DropdownDirection
  readonly className?: string
}

interface DropdownState {
  readonly open: boolean
}

class Dropdown extends React.PureComponent<DropdownProps, DropdownState> {
  public static defaultProps: Partial<DropdownProps> = {
    direction: DropdownDirection.DOWN,
    closeOnOutClick: true,
  }

  public static getDerivedStateFromProps(
    props: DropdownProps,
    state?: DropdownState,
  ): DropdownState {
    return {
      open:
        props.open !== undefined
          ? props.open
          : state
          ? state.open
          : props.defaultOpen || false,
    }
  }

  constructor(props) {
    super(props)

    this.state = Dropdown.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    const { closeOnOutClick } = this.props
    const { open } = this.state

    if (open && closeOnOutClick) {
      document.addEventListener('mousedown', this.handleDocumentClick)
    }
  }

  public componentDidUpdate(
    prevProps: DropdownProps,
    prevState: DropdownState,
  ) {
    const { closeOnOutClick } = this.props

    if (
      this.state.open &&
      prevProps.closeOnOutClick &&
      !this.props.closeOnOutClick
    ) {
      document.removeEventListener('mousedown', this.handleDocumentClick)
      return
    }

    if (prevState.open !== this.state.open && closeOnOutClick) {
      if (closeOnOutClick) {
        document.addEventListener('mousedown', this.handleDocumentClick)
      }
    }
  }

  public toggle = () => {
    if (!this.state.open) {
      this.show()
    } else {
      this.hide()
    }
  }

  public show = () => {
    const { open, onOpenStateChange } = this.props
    if (open !== undefined) {
      if (onOpenStateChange) {
        onOpenStateChange(true)
      }
    } else {
      this.setState(
        { open: true },
        onOpenStateChange
          ? () => {
              onOpenStateChange(this.state.open)
            }
          : undefined,
      )
    }
  }

  public hide = () => {
    const { open, onOpenStateChange } = this.props

    if (open !== undefined) {
      if (onOpenStateChange) {
        onOpenStateChange(false)
      }
    } else {
      this.setState(
        { open: false },
        onOpenStateChange
          ? () => {
              onOpenStateChange(false)
            }
          : undefined,
      )
    }
  }

  public handleDocumentClick = (event: MouseEvent) => {
    const { open } = this.state

    if (open && event && event.target) {
      try {
        const node = ReactDOM.findDOMNode(this)
        if (node && !node.contains(event.target as Node)) {
          document.removeEventListener('mousedown', this.handleDocumentClick)
          this.hide()
        }
      } catch (err) {
        document.removeEventListener('mousedown', this.handleDocumentClick)
      }
    }
  }

  public render() {
    const { className, direction, children } = this.props
    const { open } = this.state

    return (
      <Container
        className={`${
          className ? `${className} ` : ''
        }dropdown dropdown-direction-${
          direction === DropdownDirection.DOWN ? 'down' : 'up'
        }${open ? ` open` : ''}`}
      >
        {children}
      </Container>
    )
  }
}

export default Dropdown
