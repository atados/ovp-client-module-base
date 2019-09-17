import React from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownMenu } from '../Dropdown'
import { DropdownDirection } from '../Dropdown/Dropdown'
import Icon from '../Icon'
import { withIntl } from '~/base/lib/intl'
import { WithIntlProps, defineMessages } from 'react-intl'

const InputWrapper = styled.div`
  height: auto !important;
  padding-right: 50px;

  .dropdown-direction-down.open & {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-direction-up.open & {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`

const Menu = styled(DropdownMenu)`
  margin-top: 0;
  left: 1px;
  right: 1px;

  .dropdown-direction-up & {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-direction-down & {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`

const SelectedOption = styled.div`
  margin: 3px;
  display: inline-block;
  font-size: 80%;
  border-radius: 2px;
  background: #d6efff;
  color: #0366d6;
`

const SelectedOptionLabel = styled.div`
  padding: 3px 8px;
  display: inline-block;
`

const SelectedOptions = styled.div`
  margin: -3px -8px;
`

const OptionRemoveButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 5px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
`

const DropButton = styled.button`
  font-size: 120%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding-left: 10px;
  padding-right: 10px;
`

const Option = styled.button`
  border-radius: 0;
`

const Placeholder = styled.button`
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 0;
  width: 100%;
  text-align: left;

  &:hover,
  &:focus {
    background: none;
  }
`

const m = defineMessages({
  placeholder: {
    id: 'inputSelect.placeholder',
    defaultMessage: 'Seleciona as opções',
  },
})

export interface InputSelectItem {
  value: any
  label: React.ReactNode
}

interface InputSelectProps {
  readonly className?: string
  readonly placeholder?: React.ReactNode
  readonly inputClassName?: string
  readonly items: InputSelectItem[]
  readonly selectedItems?: InputSelectItem[]
  readonly defaultSelectedItems?: InputSelectItem[]
  readonly onChange?: (selectedItems: InputSelectItem[]) => any
  readonly onBlur?: () => any
  readonly direction?: DropdownDirection
}

interface InputSelectState {
  selectedItems: InputSelectItem[]
  open: boolean
}

class InputSelect extends React.PureComponent<
  InputSelectProps & WithIntlProps<any>,
  InputSelectState
> {
  public static getDerivedStateFromProps(
    props: InputSelectProps,
    state?: InputSelectState,
  ): InputSelectState {
    return {
      selectedItems:
        props.selectedItems ||
        (state ? state.selectedItems : props.defaultSelectedItems || []),
      open: state ? state.open : false,
    }
  }

  constructor(props) {
    super(props)

    this.state = InputSelect.getDerivedStateFromProps(props)
  }

  public toggle = () => {
    const { onBlur } = this.props

    if (this.state.open && onBlur) {
      onBlur()
    }

    this.setState({ open: !this.state.open })
  }

  public handleOpenStateChange = (open: boolean) => {
    const { onBlur } = this.props

    if (!open && onBlur) {
      onBlur()
    }

    this.setState({ open })
  }

  public select = (item: InputSelectItem) => {
    const { onChange, selectedItems: fixedSelectedItems } = this.props
    const selectedItems = [...this.state.selectedItems, item]

    if (onChange) {
      onChange(selectedItems)
    }

    if (!fixedSelectedItems) {
      this.setState({
        selectedItems,
      })
    }
  }

  public remove = (item: InputSelectItem) => {
    const { onChange, selectedItems: fixedSelectedItems } = this.props
    const selectedItems = this.state.selectedItems.filter(
      candidate => candidate !== item,
    )

    if (onChange) {
      onChange(selectedItems)
    }

    if (!fixedSelectedItems) {
      this.setState({
        selectedItems,
      })
    }
  }

  public render() {
    const intl = this.props.intl
    const {
      className,
      inputClassName,
      items,
      direction,
      placeholder = intl.formatMessage(m.placeholder),
    } = this.props
    const { selectedItems, open } = this.state

    const values = selectedItems.map(item => item.value)

    return (
      <Dropdown
        open={open}
        className={className}
        onOpenStateChange={this.handleOpenStateChange}
        direction={direction}
      >
        <InputWrapper
          className={`input ${inputClassName ? ` ${inputClassName}` : ''}`}
        >
          {selectedItems.length > 0 ? (
            <SelectedOptions>
              {selectedItems.map(item => (
                <SelectedOption key={item.value}>
                  <SelectedOptionLabel>{item.label}</SelectedOptionLabel>
                  <OptionRemoveButton
                    type="button"
                    className="btn btn-text-primary"
                    onClick={() => this.remove(item)}
                  >
                    <Icon name="close" />
                  </OptionRemoveButton>
                </SelectedOption>
              ))}
            </SelectedOptions>
          ) : (
            <Placeholder
              type="button"
              className="btn btn-text"
              onClick={this.toggle}
            >
              {placeholder}
            </Placeholder>
          )}
          <DropButton
            onClick={this.toggle}
            type="button"
            className="btn btn-text"
          >
            <Icon name="keyboard_arrow_down" />
          </DropButton>
        </InputWrapper>
        <Menu>
          {items
            .filter(item => values.indexOf(item.value) === -1)
            .map(item => (
              <Option
                type="button"
                key={item.value}
                className="btn btn-text btn--block ta-left tw-normal"
                onClick={() => this.select(item)}
              >
                {item.label}
              </Option>
            ))}
        </Menu>
      </Dropdown>
    )
  }
}

export default withIntl(InputSelect)
