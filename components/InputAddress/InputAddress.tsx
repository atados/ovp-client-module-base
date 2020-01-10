import React from 'react'
import styled from 'styled-components'
import { getPlacePredictions } from '~/lib/maps/google-maps-autocomplete'
import { reportError } from '~/lib/utils/error'
import Dropdown, { DropdownMenu } from '../Dropdown'
import Icon from '../Icon'
import { Color } from '~/common'

const InputIcon = styled(Icon)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto;
  font-size: 20px;
  color: #999;
  height: 30px;

  &.active {
    color: ${Color.primary[500]};
  }

  &.right {
    left: auto;
    right: 10px;
    color: #444;
  }
`

const Input = styled.input`
  padding-left: 36px;

  &.has-address {
    visibility: hidden;
  }

  &.open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:focus + ${InputIcon} {
    color: ${Color.primary[500]};
  }
`

const Option = styled.button`
  padding: 10px;
  background: none;
  width: 100%;
  display: block;
  text-align: left;
  border: 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #eee;

  &:hover {
    background: ${Color.primary[500]};
    color: #fff;
  }
`

const Menu = styled(DropdownMenu)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;
  left: 1px;
  right: 1px;

  ${Option}::last-child {
    border-radius: 0 0 4px 4px;
    border-bottom-width: 0;
  }
`

const Overlay = styled.button`
  padding-left: 36px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 4px;
  color: ${Color.primary[500]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  padding-right: 36px;
  cursor: pointer;
  z-index: 5;
  background: none;
`

export enum AddressKind {
  WEAK,
  STRONG,
}

interface InputAddressValue<Payload> {
  kind: AddressKind
  node: Payload
}

interface StrongInputAddressValue
  extends InputAddressValue<google.maps.places.AutocompletePrediction> {
  kind: AddressKind.STRONG
}

interface WeakAddress {
  description: string
}

interface WeakInputAddressValue extends InputAddressValue<WeakAddress> {
  kind: AddressKind.WEAK
}

export type InputAddressValueType =
  | StrongInputAddressValue
  | WeakInputAddressValue
  | null

interface InputAddressProps {
  readonly id?: string
  readonly name?: string
  readonly className?: string
  readonly onChange?: (address: InputAddressValueType) => void
  readonly onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  readonly containerClassName?: string
  readonly options?: {
    types?: string[]
  }
  readonly address?: InputAddressValueType
  readonly defaultValue?: InputAddressValueType
  readonly placeholder?: string
}

interface InputAddressState {
  inputValue: string
  nodes: google.maps.places.AutocompletePrediction[]
  open: boolean
  address: InputAddressValueType
}

class InputAddress extends React.Component<
  InputAddressProps,
  InputAddressState
> {
  public static getDerivedStateFromProps(
    props: InputAddressProps,
    state?: InputAddressState,
  ): InputAddressState {
    return {
      inputValue: state ? state.inputValue : '',
      nodes: state ? state.nodes : [],
      open: state ? state.open : false,
      address:
        props.address === undefined
          ? state
            ? state.address
            : props.defaultValue || null
          : props.address,
    }
  }

  public input: HTMLInputElement | null
  public timeout: number

  constructor(props) {
    super(props)

    this.state = InputAddress.getDerivedStateFromProps(props)
  }

  public componentDidUpdate(prevProps: InputAddressProps) {
    if (prevProps.address && this.props.address === null && this.input) {
      this.input.focus()
    }
  }

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: inputValue },
    } = event

    this.setState({
      inputValue,
      nodes: inputValue.length < 1 ? [] : this.state.nodes,
    })

    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    if (inputValue.length < 1) {
      return
    }

    this.timeout = window.setTimeout(async () => {
      try {
        const nodes = await getPlacePredictions({
          ...this.props.options,
          input: inputValue,
        })

        this.setState({ nodes })
      } catch (error) {
        if (error !== google.maps.GeocoderStatus.ZERO_RESULTS) {
          reportError(error)
        }

        this.setState({ nodes: [] })
      }
    }, 200)
  }

  public open = () => {
    this.setState({ open: true })
  }

  public handleDropdownOpenStateChange = (open: boolean) => {
    this.setState({ open })
  }

  public handleOptionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index: number = parseInt(
      (event.target as HTMLElement).dataset.index || '-1',
      10,
    )

    if (index >= 0) {
      const { nodes } = this.state
      const node = nodes[index]

      if (node) {
        const { onChange, address: fixedAddress } = this.props

        if (onChange) {
          onChange({ kind: AddressKind.STRONG, node })
        }

        if (fixedAddress !== undefined) {
          return
        }

        this.setState({
          inputValue: node.description,
          address: { kind: AddressKind.STRONG, node },
          open: false,
        })
      }
    }
  }

  public reset = () => {
    const { onChange, address: fixedAddress } = this.props

    if (onChange) {
      onChange(null)
    }

    if (fixedAddress !== undefined) {
      return
    }
    this.setState({ address: null }, () => {
      if (this.input) {
        this.input.focus()
      }
    })
  }

  public refInput = (ref: HTMLInputElement | null) => {
    this.input = ref
  }

  public render() {
    const { className, containerClassName, defaultValue, ...props } = this.props
    const { inputValue, address, nodes, open } = this.state
    const dropdownOpen = open && nodes.length > 0 && !address

    return (
      <Dropdown
        open={dropdownOpen}
        onOpenStateChange={this.handleDropdownOpenStateChange}
        className={containerClassName}
      >
        {address && (
          <Overlay type="button" onClick={this.reset} className={className}>
            {address.node.description}
          </Overlay>
        )}
        {
          // @ts-ignore
          <Input
            // @ts-ignore
            ref={this.refInput}
            {...props}
            type="text"
            onChange={this.handleInputChange}
            onFocus={this.open}
            autoComplete="false"
            className={`${address ? 'has-address ' : ''}${
              dropdownOpen ? 'open' : ''
            }${className ? ` ${className}` : ''}`}
            value={inputValue}
          />
        }
        <InputIcon name="place" className={`${address ? 'active' : ''} z-50`} />
        {address && <InputIcon name="close" className="right z-50" />}
        <Menu id="input-address-options">
          {nodes.map((node, i) => (
            <Option
              data-index={i}
              key={node.place_id}
              type="button"
              className="block py-2"
              onClick={this.handleOptionClick}
            >
              {node.description}
            </Option>
          ))}
        </Menu>
      </Dropdown>
    )
  }
}

export default InputAddress
