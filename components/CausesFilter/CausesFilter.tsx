import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import React from 'react'
import { withStartupData, UseStartupDataResult } from '~/hooks/use-startup-data'
import SearchFilter from '~/components/SearchFilters/SearchFilter'
import ActivityIndicator from '~/components/ActivityIndicator'
import { DropdownMenu } from '~/components/Dropdown'
import { pushToDataLayer } from '~/lib/tag-manager'
import { API } from '~/types/api'

const Menu = styled(DropdownMenu)`
  left: 10px;
  right: 10px;

  @media (min-width: 768px) {
    left: 0;
    right: auto;
    width: 500px;
  }
`

const CauseIndicator = styled.span`
  display: inline-block;
  vertical-align: top;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  margin: 7px 5px 0 0;
`

interface CausesFilterProps {
  readonly value?: number[]
  readonly className?: string
  readonly causes?: API.Cause[]
  readonly startupData?: UseStartupDataResult
  readonly onCommit: () => void
  readonly onChange: (newValue: number[]) => void
  readonly onOpenStateChange?: (open: boolean) => void
}

class CausesFilter extends React.Component<CausesFilterProps> {
  public static defaultProps = {
    value: [],
  }

  public handleCauseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { startupData, onChange, value: currentValue } = this.props
    const {
      target: { checked },
    } = event
    const causeId = parseInt(event.target.value, 10)
    const causes = startupData?.data ? startupData?.data?.causes : []
    const cause = causes.find(c => c.id === causeId)

    if (cause && currentValue) {
      pushToDataLayer({
        event: 'search',
        type: 'cause',
        text: cause.name,
      })

      if (checked) {
        onChange([...currentValue, causeId])
      } else {
        onChange(currentValue.filter(id => id !== causeId))
      }
    }
  }

  public reset = () => {
    this.props.onChange([])
  }

  public render() {
    const {
      className,
      onCommit,
      onOpenStateChange,
      value = [],
      startupData,
    } = this.props

    const data = startupData?.data
    const loading = startupData?.loading

    const causes = data ? data?.causes : []

    const children: React.ReactNode[][] = [[], []]
    let label: string | React.ReactNode = (
      <FormattedMessage id="causesFilter.value" defaultMessage="Causas" />
    )

    if (value.length === 1) {
      const cause = causes.find(item => item.id === value[0])
      label = cause ? cause.name : '-'
    } else if (value.length > 1) {
      label = (
        <>
          {label} · {value.length}
        </>
      )
    }

    causes.forEach((cause, i) => {
      children[i > causes.length / 2 ? 1 : 0].push(
        <label
          id={`explore-filter-cause-${cause.id}`}
          className="mb-1 block"
          key={cause.id}
        >
          <input
            id={`explore-filter-cause-${cause.id}`}
            type="checkbox"
            value={cause.id}
            className="hidden"
            onChange={this.handleCauseChange}
            checked={value.indexOf(cause.id) !== -1}
          />
          <span className="checkbox-indicator mr-2" />
          <CauseIndicator style={{ backgroundColor: cause.color }} />
          {cause.name}
        </label>,
      )
    })

    return (
      <SearchFilter
        onOpenStateChange={onOpenStateChange}
        menuAs={Menu as React.ComponentType}
        className={className}
        onCommit={onCommit}
        onReset={this.reset}
        active={value.length > 0}
        label={label}
      >
        <div className="p-3">
          <h4 className="font-normal text-lg mb-4">
            <FormattedMessage
              id="causesFilter.title"
              defaultMessage="Filtrar por causa"
            />
          </h4>
          <div className="flex flex-wrap">
            {(loading && <ActivityIndicator size={36} />) ||
              children.map((child, i) => (
                <div className="md:w-1/2" key={i}>
                  {child}
                </div>
              ))}
          </div>
        </div>
      </SearchFilter>
    )
  }
}

export default withStartupData(CausesFilter)
