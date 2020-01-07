import React from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownMenu } from '../Dropdown'
import Icon from '../Icon'
import { channel } from '~/base/common/constants'
import { Config } from '~/base/common'

const CloseButton = styled.button`
  border-radius: 50%;
  padding: 6px;
  font-size: 20px;
`

const Menu = styled(DropdownMenu)`
  position: absolute;
  z-index: 10200;
  background: ${Config.popover.backgroundColor ||
    channel.theme.color.primary[500]};
  padding: 16px;
  color: #fff;
  border-radius: 10px;
  margin-top: 12px;
  top: 100%;
  left: auto;
  white-space: normal;
  right: -8px;
  width: 360px;

  &::after {
    content: '';
    border-width: 0 8px 8px;
    border-color: ${channel.theme.color.primary[500]} rgba(0, 0, 0, 0);
    border-style: solid;
    width: 0;
    height: 0;
    position: absolute;
    top: -8px;
    right: 16px;
    display: block;
  }
`

const Container = styled(Dropdown)`
  .dropdown-menu {
    display: none !important;
    z-index: 50;
  }

  &.open .dropdown-menu {
    display: block !important;
  }
`

interface PopoverProps {
  readonly disableButtons?: boolean
  readonly className?: string
  readonly expiresIn?: number
  readonly id: string
  readonly body?: React.ReactNode
  readonly onConfirm?: () => void
  readonly onCancel?: () => void
  readonly onClose?: () => void
}

let popoversState: { [key: string]: number } | undefined
class Popover extends React.Component<PopoverProps> {
  public dropdown: Dropdown | null
  public componentDidMount() {
    const { id, expiresIn, disableButtons } = this.props

    if (!popoversState) {
      const storedJSON = localStorage.getItem('@@popovers')

      try {
        if (storedJSON) {
          popoversState = JSON.parse(storedJSON)
        } else {
          popoversState = {}
        }
      } catch (error) {
        popoversState = {}
      }
    }

    const createdAt = popoversState![id]
    if (!createdAt || (expiresIn && createdAt + expiresIn <= Date.now())) {
      if (this.dropdown) {
        this.dropdown.toggle()

        if (disableButtons) {
          this.setAsRead()
        }
      }
    }
  }

  public setAsRead = () => {
    const { id } = this.props

    localStorage.setItem(
      '@@popovers',
      JSON.stringify({
        ...popoversState,
        [id]: Date.now(),
      }),
    )
  }

  public close = () => {
    const { onClose, onCancel } = this.props
    this.setAsRead()

    if (this.dropdown) {
      this.dropdown.toggle()
    }

    if (onClose) {
      onClose()
      return
    }

    if (onCancel) {
      onCancel()
    }
  }

  public cancel = () => {
    const { onCancel } = this.props
    this.setAsRead()

    if (this.dropdown) {
      this.dropdown.toggle()
    }

    if (onCancel) {
      onCancel()
    }
  }

  public confirm = () => {
    const { onConfirm } = this.props
    this.setAsRead()

    if (this.dropdown) {
      this.dropdown.toggle()
    }

    if (onConfirm) {
      onConfirm()
    }
  }

  public render() {
    const { className, children, body, disableButtons } = this.props

    return (
      <Container
        ref={ref => {
          this.dropdown = ref as Dropdown
        }}
        className={className}
      >
        {children}
        <Menu>
          <CloseButton
            type="button"
            className="btn btn-text-white float-right"
            onClick={this.close}
          >
            <Icon name="close" />
          </CloseButton>
          {body}
          {!disableButtons && (
            <div className="text-right">
              <button
                type="button"
                className="btn bg-white-alpha-10 hover:bg-alpha-20 btn--size-2"
                onClick={this.cancel}
              >
                ENTENDI
              </button>
              <button
                type="button"
                className="btn btn-text-white ml-1 btn--size-2"
                onClick={this.confirm}
              >
                VAMOS LÁ
              </button>
            </div>
          )}
        </Menu>
      </Container>
    )
  }
}

export default Popover
