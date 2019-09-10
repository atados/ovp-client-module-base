import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { DropdownMenu } from '~/components/Dropdown'
import SearchFilter from '~/components/SearchFilters/SearchFilter'
import { pushToDataLayer } from '~/lib/tag-manager'
import { Skill } from '~/common/channel'
import { RootState } from '~/redux/root-reducer'

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
  readonly skills: Skill[]
  readonly onCommit: () => void
  readonly onChange: (newValue: number[]) => void
  readonly onOpenStateChange?: (open: boolean) => void
}

class SkillsFilter extends React.Component<SkillsFilterProps> {
  public static defaultProps = {
    value: [],
  }

  public handleSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { skills, onChange, value: currentValue } = this.props
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
      skills,
      className,
      onCommit,
      onOpenStateChange,
      value = [],
    } = this.props
    const children: React.ReactNode[][] = [[], []]
    let label: string = 'Habilidades'

    if (value.length === 1) {
      const skill = skills.find(item => item.id === value[0])
      label = skill ? skill.name : '-'
    } else if (value.length > 1) {
      label += ` · ${value.length}`
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
          <h4 className="tw-normal ts-medium mb-3">Filtrar por habilidade</h4>
          <div className="row">
            {children.map((child, i) => (
              <div className="col-sm-6" key={i}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </SearchFilter>
    )
  }
}

const mapStateToProps = ({ startup }: RootState) => ({ skills: startup.skills })
export default connect(mapStateToProps)(SkillsFilter)
