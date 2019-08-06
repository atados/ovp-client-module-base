import React from 'react'
import styled, { StyledProps } from 'styled-components'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Popover from '~/components/Popover/Popover'

const CountIndicator = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4d4d;
  border-radius: 10px;
  color: #fff;
  font-size: 11px;
  padding: 3px 5px;
  line-height: 1;
  font-weight: 500;
  pointer-events: none;
  z-index: 100;
`

interface MenuProps {
  width: string
  height: string
}
const Menu = styled(DropdownMenu)`
  width: ${(props: MenuProps) => props.width};
  height: ${(props: MenuProps) => props.height};
  left: auto;

  &::after {
    content: '';
    border-width: 0 6px 6px;
    border-color: #fff rgba(0, 0, 0, 0);
    border-style: solid;
    width: 0;
    height: 0;
    position: absolute;
    top: -6px;
    right: 10px;
    display: block;
  }
`

interface ButtonIconProps {
  darkIcons?: boolean
}
export const ButtonIcon = styled.button`
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0 5px;

  ${(props: StyledProps<ButtonIconProps>) => `

  color: ${
    props.darkIcons || props.theme.darkIcons
      ? 'rgba(0, 0, 0, 0.5)'
      : 'rgba(255, 255, 255, 0.6)'
  } !important;
  font-size: 24px;

  > svg {
    vertical-align: -3px;
  }

  > svg g,
  > svg rect,
  > svg path,
  > svg circle {
    fill: ${
      props.darkIcons || props.theme.darkIcons
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(255, 255, 255, 0.6)'
    };
  }

  &:hover {
    color: ${
      props.darkIcons || props.theme.darkIcons
        ? 'rgba(0, 0, 0, 0.75)'
        : 'rgba(255, 255, 255, 0.75)'
    };

    > .tooltip {
      display: block;
    }
  }

  &:hover > svg g,
  &:hover > svg rect,
  &:hover > svg path,
  &:hover > svg circle {
    fill: ${
      props.darkIcons || props.theme.darkIcons
        ? 'rgba(0, 0, 0, 0.65)'
        : 'rgba(255, 255, 255, 0.75)'
    };
  }

  .open & {
    color: #fff !important;

    .tooltip {
      display: none;
    }
  }

  .open & > svg g,
  .open & > svg rect,
  .open & > svg path,
  .open & > svg circle {
    fill: #fff;
  }

  `}
`

interface ToolbarDropdownProps {
  readonly className?: string
  readonly title: string
  readonly open?: boolean
  readonly pendingCount?: number
  readonly menuWidth: string
  readonly menuHeight: string
  readonly onOpen: () => void
  readonly icon?: React.ReactNode
  readonly popover?: React.ReactNode
  readonly popoverId?: string
  readonly popoverExpiration?: number
}

class ToolbarDropdown extends React.Component<ToolbarDropdownProps> {
  public dropdown: Dropdown | null

  public componentDidMount() {
    if (this.props.open && this.dropdown) {
      this.dropdown.show()
    }
  }

  public handleClick = (event: React.MouseEvent) => {
    event.preventDefault()

    if (this.dropdown) {
      this.dropdown.toggle()
    }
  }

  public refDropdown = (ref: Dropdown | null) => {
    this.dropdown = ref
  }

  public handleOpenStateChange = (isOpen: boolean) => {
    if (isOpen) {
      this.props.onOpen()
    }
  }

  public render() {
    const {
      className,
      menuWidth,
      menuHeight,
      children,
      pendingCount,
      popover,
      icon,
      popoverId,
      popoverExpiration,
    } = this.props

    const button = <ButtonIcon onClick={this.handleClick}>{icon}</ButtonIcon>

    return (
      <Dropdown
        ref={this.refDropdown}
        className={`${popover ? 'active ' : ''}${className ? className : ''}`}
        onOpenStateChange={this.handleOpenStateChange}
      >
        {pendingCount ? <CountIndicator>{pendingCount}</CountIndicator> : null}
        {popover && popoverId ? (
          <Popover id={popoverId} expiresIn={popoverExpiration} body={popover}>
            {button}
          </Popover>
        ) : (
          button
        )}
        <Menu width={menuWidth} height={menuHeight}>
          {children}
        </Menu>
      </Dropdown>
    )
  }
}

export default ToolbarDropdown
