import React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { JobDate } from '~/redux/ducks/project'
import DisponibilityJobForm from './DisponibilityJobForm'
import DisponibilityWorkForm from './DisponibilityWorkForm'
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

const OptionHeader = styled.button`
  width: 100%;
  background: none;
  border: 0;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f6f6f6;
  }

  &:focus {
    outline: none;
  }
`
const Option = styled.div`
  width: 100%;
  border-radius: 0 !important;

  &.active {
    box-shadow: -2px 0 ${channel.theme.color.secondary[500]};

    ${OptionHeader} {
      border-bottom: 1px solid #ddd;
    }
  }
`

const OptionBody = styled.div`
  background: #f6f7f8;
  padding-left: 50px !important;
`

const {
  RECORRENTE,
  EXIGE_COMPROMETIMENTO,
  PONTUAL,
  E_NECESSARIO,
  DOACAO,
  VAGA_DESTINADA,
} = defineMessages({
  RECORRENTE: {
    id: 'disponibilityInput.recurrent',
    defaultMessage: 'Recorrente',
  },
  EXIGE_COMPROMETIMENTO: {
    id: 'EXIGE_COMPROMETIMENTO',
    defaultMessage:
      'Exige comprometimento por um período mais longo, durante meses ou anos.',
  },
  PONTUAL: {
    id: 'PONTUAL',
    defaultMessage: 'Pontual',
  },
  E_NECESSARIO: {
    id: 'E_NECESSARIO',
    defaultMessage:
      'É necessário dedicar-se por um curto período de tempo, em um dia ou uma semana para a realização das atividades.',
  },
  DOACAO: {
    id: 'DOACAO',
    defaultMessage: 'Doação',
  },
  VAGA_DESTINADA: {
    id: 'VAGA_DESTINADA',
    defaultMessage: 'Vaga destinada a doação',
  },
})

export interface DisponibilityInputWorkBaseType {
  type: 'work'
  donation: boolean
  work: {
    description: string
    weekly_hours: number
    can_be_done_remotely: boolean
  }
}

export interface DisponibilityInputWorkType
  extends DisponibilityInputWorkBaseType {
  type: 'work'
  donation: false
  work: {
    description: string
    weekly_hours: number
    can_be_done_remotely: boolean
  }
}

export interface DisponibilityInputJobType {
  type: 'job'
  job: {
    dates: JobDate[]
  }
}

export interface DisponibilityInputDonationType
  extends DisponibilityInputWorkBaseType {
  donation: true
}

export type DisponibilityInputValue =
  | DisponibilityInputWorkType
  | DisponibilityInputJobType
  | DisponibilityInputDonationType
  | null
interface DisponibilityInputProps {
  readonly className?: string
  readonly onChange?: (newValue: DisponibilityInputValue) => any
  readonly onBlur?: () => any
  readonly value?: DisponibilityInputValue
  readonly defaultValue?: DisponibilityInputValue
}

interface DisponibilityInputState {
  value: DisponibilityInputValue
}

class DisponibilityInput extends React.PureComponent<
  DisponibilityInputProps & WithIntlProps<any>,
  DisponibilityInputState
> {
  public static getDerivedStateFromProps(
    props: DisponibilityInputProps,
    state?: DisponibilityInputState,
  ): DisponibilityInputState {
    return {
      value:
        props.value !== undefined
          ? props.value
          : state
          ? state.value
          : props.defaultValue || null,
    }
  }

  constructor(props) {
    super(props)

    this.state = DisponibilityInput.getDerivedStateFromProps(props)
  }

  public setType = (type: 'work' | 'job' | 'donation') => {
    const { onChange, value: fixedValue } = this.props
    let value: DisponibilityInputValue | undefined

    if (type === 'donation') {
      value = {
        type: 'work',
        donation: true,
        work: {
          description: '',
          weekly_hours: 0,
          can_be_done_remotely: false,
        },
      }
    } else if (type === 'job') {
      value = {
        type: 'job',
        job: {
          dates: [],
        },
      }
    } else {
      value = {
        type: 'work',
        donation: false,
        work: {
          description: '',
          weekly_hours: 0,
          can_be_done_remotely: false,
        },
      }
    }

    if (fixedValue === undefined) {
      this.setState({
        value,
      })
    } else if (onChange) {
      onChange(value)
    }
  }

  public handleJobFormChange = (dates: JobDate[]) => {
    const { onChange, value: fixedValue } = this.props
    const value: DisponibilityInputValue = {
      type: 'job',
      job: { dates },
    }

    if (!this.state.value || this.state.value.type !== 'job') {
      return
    }

    if (fixedValue === undefined) {
      this.setState({
        value,
      })
    } else if (onChange) {
      onChange(value)
    }
  }

  public handleWorkFormChange = (work: {
    description: string
    weekly_hours: number
  }) => {
    const { onChange, value: fixedValue } = this.props

    if (!fixedValue || fixedValue.type !== 'work') {
      return
    }

    const value: DisponibilityInputValue = {
      type: 'work',
      donation: fixedValue.donation as any,
      work: {
        can_be_done_remotely: false,
        ...work,
      },
    }

    if (fixedValue === undefined) {
      this.setState({
        value,
      })
    } else if (onChange) {
      onChange(value)
    }
  }

  public handleBlur = () => {
    const { onBlur } = this.props

    if (onBlur) {
      onBlur()
    }
  }

  public render() {
    const { className, intl } = this.props
    const { value } = this.state

    return (
      <div className={`card radius-0${className ? ` ${className}` : ''}`}>
        <Option
          className={`card-item${
            value && value.type === 'work' && !value.donation ? ' active' : ''
          }`}
        >
          <OptionHeader
            type="button"
            className="p-3 media"
            onClick={() => this.setType('work')}
            onBlur={this.handleBlur}
          >
            <span
              className={`input-radio${
                value && value.type === 'work' && !value.donation
                  ? ' checked'
                  : ''
              }`}
            />
            <div className="media-body ml-3">
              <h5 className="tw-normal mb-1">
                {intl.formatMessage(RECORRENTE)}
              </h5>
              <p className="tc-muted-dark ts-small mb-0">
                {intl.formatMessage(EXIGE_COMPROMETIMENTO)}
              </p>
            </div>
          </OptionHeader>
          {value && value.type === 'work' && !value.donation && (
            <OptionBody className="p-3">
              <DisponibilityWorkForm
                onBlur={this.handleBlur}
                defaultValue={value.work}
                onChange={this.handleWorkFormChange}
                isDonation={false}
              />
            </OptionBody>
          )}
        </Option>
        <Option
          className={`card-item${
            value && value.type === 'job' ? ' active' : ''
          }`}
        >
          <OptionHeader
            type="button"
            className="p-3 media"
            onClick={() => this.setType('job')}
            onBlur={this.handleBlur}
          >
            <span
              className={`input-radio${
                value && value.type === 'job' ? ' checked' : ''
              }`}
            />
            <div className="media-body ml-3">
              <h5 className="tw-normal mb-1">{intl.formatMessage(PONTUAL)}</h5>
              <p className="tc-muted-dark ts-small mb-0">
                {intl.formatMessage(E_NECESSARIO)}
              </p>
            </div>
          </OptionHeader>
          {value && value.type === 'job' && (
            <OptionBody className="p-3">
              <DisponibilityJobForm
                onBlur={this.handleBlur}
                dates={value.job.dates}
                onChange={this.handleJobFormChange}
              />
            </OptionBody>
          )}
        </Option>
        {channel.config['project.disponibility.donation'] && (
          <Option
            className={`card-item${
              value && value.type === 'work' && value.donation ? ' active' : ''
            }`}
          >
            <OptionHeader
              type="button"
              className="p-3 media"
              onClick={() => this.setType('donation')}
              onBlur={this.handleBlur}
            >
              <span
                className={`input-radio${
                  value && value.type === 'work' && value.donation
                    ? ' checked'
                    : ''
                }`}
              />
              <div className="media-body ml-3">
                <h5 className="tw-normal mb-1">{intl.formatMessage(DOACAO)}</h5>
                <p className="tc-muted-dark ts-small mb-0">
                  {intl.formatMessage(VAGA_DESTINADA)}
                </p>
              </div>
            </OptionHeader>
            {value && value.type === 'work' && value.donation && (
              <OptionBody className="p-3">
                <DisponibilityWorkForm
                  onBlur={this.handleBlur}
                  defaultValue={value.work}
                  onChange={this.handleWorkFormChange}
                  isDonation={value.donation}
                />
              </OptionBody>
            )}
          </Option>
        )}
      </div>
    )
  }
}

export default withIntl(DisponibilityInput)
