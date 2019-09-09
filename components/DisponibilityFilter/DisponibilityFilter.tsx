import React from 'react'
import styled from 'styled-components'
import { DropdownMenu } from '~/components/Dropdown'
import SearchFilter from '~/components/SearchFilters/SearchFilter'
import { pushToDataLayer } from '~/lib/tag-manager'
import { DisponibilityFilterValue } from '~/redux/ducks/search'
import { defineMessages, InjectedIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

const Menu = styled(DropdownMenu)`
  left: 10px;
  right: 10px;

  @media (min-width: 768px) {
    left: 0;
    right: auto;
    width: 400px;
  }
`

const Input = styled.input`
  float: left;
  margin-left: -30px;
  display: none;
`

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding-left: 30px;

  > li {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ItemName = styled.h4`
  cursor: pointer;
  font-weight: normal;
  font-size: 18px;
  margin-bottom: 5px;
`

const ItemDescription = styled.p`
  cursor: pointer;
  color: #666;
  margin: 0;
  font-size: 14px;
`

const Indicator = styled.span.attrs({ className: 'checkbox-indicator' })`
  float: left;
  margin-left: -30px;
`

const {
  FILTRAR,
  RECORRENTE,
  VAGAS_QUE_EXIGEM,
  PONTUAIS,
  NECESSARIO,
} = defineMessages({
  FILTRAR: {
    id: 'FILTRAR',
    defaultMessage: 'Filtrar por tipo',
  },
  RECORRENTE: {
    id: 'RECORRENTE',
    defaultMessage: 'Recorrentes',
  },
  VAGAS_QUE_EXIGEM: {
    id: 'VAGAS_QUE_EXIGEM',
    defaultMessage:
      'Vagas que exigem exigem comprometimento por um período mais longo.',
  },
  PONTUAIS: {
    id: 'PONTUAIS',
    defaultMessage: 'Pontuais',
  },
  NECESSARIO: {
    id: 'NECESSARIO',
    defaultMessage:
      'É necessário dedicar-se por um curto período de tempo, em um dia ou uma semana, para a realização das atividades.',
  },
})

interface DisponibilityFilterProps {
  readonly onCommit: () => void
  readonly value?: DisponibilityFilterValue
  readonly className?: string
  readonly onChange: (newValue: DisponibilityFilterValue) => void
  readonly onOpenStateChange?: (open: boolean) => void
}

interface DisponibilityFilterState {
  checked: {
    work: boolean
    job: boolean
  }
}

class DisponibilityFilter extends React.Component<
  DisponibilityFilterProps & InjectedIntlProps,
  DisponibilityFilterState
> {
  public static defaultProps: Partial<DisponibilityFilterProps> = {}
  public static getDerivatedStateFromProps(
    props: DisponibilityFilterProps,
    state?: DisponibilityFilterState,
  ): DisponibilityFilterState {
    return {
      checked: state
        ? state.checked
        : props.value === 'work'
        ? { work: true, job: false }
        : props.value === 'job'
        ? { work: false, job: true }
        : { work: false, job: false },
    }
  }

  constructor(props) {
    super(props)

    this.state = DisponibilityFilter.getDerivatedStateFromProps(props)
  }

  public handleInputChange = ({
    target: { checked, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const { checked: currentCheckState } = this.state
    const newCheckState = { ...currentCheckState, [name]: checked }

    this.setState({ checked: newCheckState })

    const newValue =
      newCheckState.job && newCheckState.work
        ? 'both'
        : newCheckState.job
        ? 'job'
        : newCheckState.work
        ? 'work'
        : 'both'

    pushToDataLayer({
      event: 'search',
      type: 'disponibility',
      text:
        newValue === 'work'
          ? 'Recorrente'
          : newValue === 'job'
          ? 'Pontual'
          : 'Ambos',
    })

    onChange(newValue)
  }

  public reset = () => {
    this.setState({ checked: { work: false, job: false } })
    this.props.onChange('both')
  }

  public render() {
    const { onCommit, className, onOpenStateChange, intl } = this.props
    const { checked } = this.state
    let label: string = 'Disponibilidade'

    if (checked.job && checked.work) {
      label = 'Recorrentes e Pontuais'
    } else if (checked.job) {
      label = 'Pontuais'
    } else if (checked.work) {
      label = 'Recorrentes'
    }

    return (
      <SearchFilter
        onOpenStateChange={onOpenStateChange}
        menuAs={Menu as React.ComponentType}
        className={className}
        label={label}
        active={checked.work || checked.job}
        onCommit={onCommit}
        onReset={this.reset}
      >
        <div className="p-3">
          <h4 className="tw-normal ts-medium mb-3">
            {intl.formatMessage(FILTRAR)}
          </h4>
          <List>
            <li>
              <label htmlFor="disponibility-filter-work">
                <Input
                  onChange={this.handleInputChange}
                  name="work"
                  id="disponibility-filter-work"
                  type="checkbox"
                  checked={checked.work}
                />
                <Indicator />
                <ItemName>{intl.formatMessage(RECORRENTE)}</ItemName>
                <ItemDescription>
                  {intl.formatMessage(VAGAS_QUE_EXIGEM)}
                </ItemDescription>
              </label>
            </li>
            <li>
              <label htmlFor="disponibility-filter-job">
                <Input
                  onChange={this.handleInputChange}
                  name="job"
                  id="disponibility-filter-job"
                  type="checkbox"
                  checked={checked.job}
                />
                <Indicator />
                <ItemName>{intl.formatMessage(PONTUAIS)}</ItemName>
                <ItemDescription>
                  {intl.formatMessage(NECESSARIO)}
                </ItemDescription>
              </label>
            </li>
          </List>
        </div>
      </SearchFilter>
    )
  }
}

export default withIntl(DisponibilityFilter)
