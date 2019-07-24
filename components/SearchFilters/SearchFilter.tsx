import * as React from 'react'
import styled, { StyledProps } from 'styled-components'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Icon from '../Icon'

interface ButtonProps {
  active?: boolean
  className?: string
}

const SearchFilterDropdown = styled(Dropdown)`
  .dropdown-menu {
    min-width: 300px;
  }
`

export const SearchFilterButton = styled.button`
  background: #fff;
  border-color: #ddd;
  font-weight: normal;
  height: 32px;
  font-size: 14px;
  padding: 6px 10px;
  white-space: nowrap;
  border-radius: 10px;

  ${(props: StyledProps<ButtonProps>) =>
    props.active
      ? `
    background: ${props.theme.colorPrimary};
    color: #fff;
    border-color: ${props.theme.colorPrimary};`
      : `
    &:hover {
      background: #f6f6f6;
      border-color: #ccc;
    }`};
`

interface SearchFilterProps {
  readonly menuAs?: React.ComponentType
  readonly className?: string
  readonly label: React.ReactNode
  readonly active?: boolean
  readonly onCommit: () => void
  readonly onReset: () => void
  readonly onOpenStateChange?: (open: boolean) => void
}

interface SearchFilterState {
  open: boolean
}

class SearchFilter extends React.Component<
  SearchFilterProps,
  SearchFilterState
> {
  public static defaultProps = {
    menuAs: DropdownMenu,
  }

  public static getDerivedStateFromProps(
    _: SearchFilterProps,
    state?: SearchFilterState,
  ): SearchFilterState {
    return {
      open: state ? state.open : false,
    }
  }

  constructor(props) {
    super(props)

    this.state = SearchFilter.getDerivedStateFromProps(props)
  }

  public componentDidUpdate(_, prevState: SearchFilterState) {
    if (prevState.open !== this.state.open) {
      const { onOpenStateChange } = this.props
      if (onOpenStateChange) {
        onOpenStateChange(this.state.open)
      }
    }
  }

  public handleDropdownOpenStateChange = (open: boolean) => {
    // Commit when dropdown is closed
    if (!open) {
      this.props.onCommit()
    }

    if (this.state.open !== open) {
      this.setState({ open })
    }
  }

  public toggle = () => {
    this.setState({ open: !this.state.open })
  }

  public commit = () => {
    this.setState({ open: false })
    this.props.onCommit()
  }

  public render() {
    const {
      className,
      children,
      active,
      label,
      onReset,
      menuAs: MenuComponent,
    } = this.props
    const { open } = this.state

    return (
      <SearchFilterDropdown
        className={className}
        open={open}
        onOpenStateChange={this.handleDropdownOpenStateChange}
      >
        <SearchFilterButton
          className="btn"
          active={open || active}
          onClick={this.toggle}
        >
          {label}
          {active && <Icon name="keyboard_arrow_down" className="ml-1" />}
        </SearchFilterButton>
        {MenuComponent && (
          <MenuComponent>
            {children}
            <div className="d-flex p-3 pt-0">
              {active && (
                <button
                  type="button"
                  onClick={onReset}
                  className="btn-plain-text tc-muted-dark tw-normal td-hover-underline"
                >
                  Limpar
                </button>
              )}
              <div className="mr-auto" />
              <button
                type="button"
                onClick={this.commit}
                className="btn-plain-text tw-normal tc-primary td-hover-underline"
              >
                Aplicar
              </button>
            </div>
          </MenuComponent>
        )}
      </SearchFilterDropdown>
    )
  }
}

export default SearchFilter
