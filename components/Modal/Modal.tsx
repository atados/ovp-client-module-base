import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import { getScrollbarSize } from '~/lib/utils/dom'

const Backdrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1200;
  transition: background 0.5s, opacity 0.5s;
  padding: 60px 10px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.4);
  display: none;

  &.open {
    display: block;
  }
`

const Body = styled.div`
  margin: 0 auto;
  position: relative;
  max-width: 552px;
`

const CloseButton = styled.button.attrs({ className: 'btn' })`
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #666;
  font-size: 20px;
  width: 42px;
  height: 42px;
`

interface ModalProps {
  readonly closeOnBackdropClick?: boolean
  readonly onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  readonly className?: string
  readonly onClose?: () => void
  readonly onOpen?: () => void
  readonly open?: boolean
  readonly defaultOpen?: boolean
}

interface ModalState {
  readonly open: boolean
}

export class Modal extends React.Component<ModalProps, ModalState> {
  public static defaultProps = {
    closeOnBackdropClick: true,
    className: undefined,
  }

  public static getDerivedStateFromProps(
    props: ModalProps,
    state?: ModalState,
  ): ModalState {
    return {
      open:
        props.open !== undefined
          ? props.open
          : state
          ? state.open
          : props.defaultOpen || false,
    }
  }
  public body: HTMLDivElement | null

  constructor(props) {
    super(props)

    this.state = Modal.getDerivedStateFromProps(props, undefined)
  }

  public componentDidMount() {
    if (this.state.open) {
      this.adjustForScrollBar()
    }
  }

  public componentDidUpdate(_, prevState) {
    const { open } = this.state
    if (prevState.open !== open) {
      this.adjustForScrollBar()
    }
  }

  public componentWillUnmount() {
    this.adjustForScrollBar(false)
  }

  public adjustForScrollBar(open: boolean = this.state.open) {
    const containerNode = document.body
    const containerClassnameArray = containerNode.className
      .split(' ')
      .filter(c => c !== 'overflow-hidden')

    containerNode.className = open
      ? containerClassnameArray.concat(['overflow-hidden']).join(' ')
      : containerClassnameArray.join(' ')

    containerNode.style.paddingRight = open ? `${getScrollbarSize()}px` : null
  }

  public open = () => {
    if (!this.state.open) {
      const { onOpen } = this.props

      if (onOpen) {
        onOpen()
      } else if (this.props.open === undefined) {
        this.setState({ open: true })
      }
    }
  }

  public close = () => {
    if (this.state.open) {
      const { onClose } = this.props

      if (onClose) {
        onClose()
      } else if (this.props.open === undefined) {
        this.setState({ open: false })
      }
    }
  }

  public handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { open } = this.state
    if (event && event.target && open) {
      try {
        // eslint-disable-next-line
        const bodyNode = ReactDOM.findDOMNode(this.body)

        if (
          (bodyNode && !bodyNode.contains(event.target as Node)) ||
          bodyNode === event.target
        ) {
          this.close()
        }
      } catch (error) {
        throw error
      }
    }
  }

  public render() {
    const { className, closeOnBackdropClick, onClick, children } = this.props
    const { open } = this.state

    return (
      <Backdrop
        onClick={closeOnBackdropClick ? this.handleBackdropClick : onClick}
        className={`${className ? `${className} ` : ''}${open ? 'open' : ''}`}
      >
        <CloseButton type="button" onClick={this.close}>
          <Icon name="clear" />
        </CloseButton>
        <Body
          ref={ref => {
            this.body = ref
          }}
        >
          {children}
        </Body>
      </Backdrop>
    )
  }
}

export default Modal
