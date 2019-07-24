import React from 'react'
import styled from 'styled-components'
import { DropdownMenu } from '~/components/Dropdown'
import SearchFilter from '~/components/SearchFilters/SearchFilter'
import ToggleSwitch from '~/components/ToggleSwitch'

const Menu = styled(DropdownMenu)`
  left: 10px;
  right: 10px;

  @media (min-width: 768px) {
    left: 0;
    right: auto;
    width: 400px;
  }
`

interface RemoteFilterProps {
  readonly onCommit: () => void
  readonly value?: boolean
  readonly className?: string
  readonly onChange: (newValue: boolean) => void
  readonly onOpenStateChange?: (open: boolean) => void
}

class RemoteFilter extends React.Component<RemoteFilterProps> {
  public static defaultProps: Partial<RemoteFilterProps> = {
    value: false,
  }

  public reset = () => {
    this.props.onChange(false)
  }

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(event.target.checked)
  }

  public render() {
    const {
      value: checked,
      onCommit,
      className,
      onOpenStateChange,
    } = this.props

    return (
      <SearchFilter
        onOpenStateChange={onOpenStateChange}
        menuAs={Menu as React.ComponentType}
        className={className}
        label={checked ? 'Somente vagas à distância' : 'Vagas à distância'}
        active={checked}
        onCommit={onCommit}
        onReset={this.reset}
      >
        <div className="p-3">
          <label htmlFor="RemoteFilterInput-Checkbox" className="media">
            <div className="media-body">
              <h4 className="tw-normal ts-medium mb-2">
                Somente vagas à distância
              </h4>
              <p className="ts-small tc-muted-dark mb-0">
                Vagas quem exigem exigem comprometimento por um período mais
                longo.
              </p>
            </div>
            <ToggleSwitch
              id="RemoteFilterInput-Checkbox"
              height={32}
              checked={checked}
              onChange={this.handleInputChange}
            />
          </label>
        </div>
      </SearchFilter>
    )
  }
}

export default RemoteFilter
