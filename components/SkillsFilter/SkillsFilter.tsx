import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import React from 'react'

import { withStartupData, UseStartupDataResult } from '~/hooks/use-startup-data'
import SearchFilter from '~/components/SearchFilters/SearchFilter'
import ActivityIndicator from '~/components/ActivityIndicator'
import { DropdownMenu } from '~/components/Dropdown'
import { pushToDataLayer } from '~/lib/tag-manager'

const Menu = styled(DropdownMenu)`
  left: 10px;
  right: 10px;

  @media (min-width: 768px) {
    left: 0;
    right: auto;
    width: 500px;
  }
`

interface SkillsFilterProps {
  readonly value?: number[]
  readonly className?: string
  readonly startupData?: UseStartupDataResult
  readonly onCommit: () => void
  readonly onChange: (newValue: number[]) => void
  readonly onOpenStateChange?: (open: boolean) => void
}

class SkillsFilter extends React.Component<SkillsFilterProps> {
  public static defaultProps = {
    value: [],
  }

  public handleSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { startupData, onChange, value: currentValue } = this.props
    const skills = startupData?.data ? startupData?.data?.skills : []
    const {
      target: { checked },
    } = event
    const skillId = parseInt(event.target.value, 10)
    const skill = skills.find(s => s.id === skillId)

    if (currentValue && skill) {
      pushToDataLayer({
        event: 'search',
        type: 'skill',
        text: String(skill.name),
      })

      if (checked) {
        onChange([...currentValue, skillId])
      } else {
        onChange(currentValue.filter(id => id !== skillId))
      }
    }
  }

  public reset = () => {
    this.props.onChange([])
  }

  public render() {
    const {
      startupData,
      className,
      onCommit,
      onOpenStateChange,
      value = [],
    } = this.props

    const data = startupData?.data
    const loading = startupData?.loading

    const skills = data ? data?.skills : []

    const children: React.ReactNode[][] = [[], []]
    let label: string | React.ReactNode = (
      <FormattedMessage id="skillsFilter.value" defaultMessage="Habilidades" />
    )

    if (value.length === 1) {
      const skill = skills.find(item => item.id === value[0])
      label = skill ? skill.name : '-'
    } else if (value.length > 1) {
      label = (
        <>
          {label} · {value.length}
        </>
      )
    }

    skills.forEach((skill, i) => {
      children[i > skills.length / 2 ? 1 : 0].push(
        <label
          id={`explore-filter-skill-${skill.id}`}
          className="mb-1 block"
          key={skill.id}
        >
          <input
            id={`explore-filter-skill-${skill.id}`}
            type="checkbox"
            value={skill.id}
            className="hidden"
            onChange={this.handleSkillChange}
            checked={value.indexOf(skill.id) !== -1}
          />
          <span className="checkbox-indicator mr-2" />
          {skill.name}
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
            {' '}
            <FormattedMessage
              id="causesFilter.title"
              defaultMessage="Filtrar por habilidade"
            />
          </h4>
          <div className="flex flex-wrap">
            {(loading && <ActivityIndicator size={36} />) ||
              children.map((child, i) => (
                <div className="w-full sm:w-1/2" key={i}>
                  {child}
                </div>
              ))}
          </div>
        </div>
      </SearchFilter>
    )
  }
}

export default withStartupData(SkillsFilter)
