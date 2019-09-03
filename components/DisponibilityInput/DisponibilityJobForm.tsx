import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { JobDate } from '~/redux/ducks/project'
import Icon from '../Icon'
import DisponibilityJobDateForm from './DisponibilityJobDateForm'

const JobIcon = styled(Icon)`
  font-size: 24px;
  margin-right: 14px;
`

interface DisponibilityJobFormProps {
  readonly className?: string
  readonly onChange?: (dates: JobDate[]) => any
  readonly onBlur?: () => any
  readonly dates?: JobDate[]
}

interface DisponibilityJobFormState {
  readonly dates: JobDate[]
  readonly editingDate?: JobDate
  readonly renderForm: boolean
}

class DisponibilityJobForm extends React.Component<
  DisponibilityJobFormProps,
  DisponibilityJobFormState
> {
  public static getDerivedStateFromProps(
    props: DisponibilityJobFormProps,
    state?: DisponibilityJobFormState,
  ): DisponibilityJobFormState {
    return {
      editingDate: state ? state.editingDate : undefined,
      renderForm: state ? state.renderForm : false,
      dates: props.dates !== undefined ? props.dates : state ? state.dates : [],
    }
  }

  constructor(props) {
    super(props)

    this.state = DisponibilityJobForm.getDerivedStateFromProps(props)
  }

  public enableForm = () => this.setState({ renderForm: true })

  public handleFormSubmit = (date: JobDate) => {
    this.setDates([...this.state.dates, date])
    this.setState({
      renderForm: false,
      editingDate: undefined,
    })
  }

  public setDates = (dates: JobDate[]) => {
    const { dates: fixedDates, onChange, onBlur } = this.props

    if (fixedDates === undefined) {
      this.setState({ dates })
    }

    if (onChange) {
      onChange(dates)
    }

    if (onBlur) {
      onBlur()
    }
  }

  public handleCancel = () => {
    const { editingDate, dates } = this.state

    if (editingDate) {
      this.setDates([...dates, editingDate])
    }

    this.setState({
      renderForm: false,
      editingDate: undefined,
    })
  }

  public removeDate = (index: number) => {
    this.setDates(this.state.dates.filter((_, i) => i !== index))
  }

  public editDate = (index: number) => {
    this.removeDate(index)
    this.setState({
      editingDate: this.state.dates[index],
    })
  }

  public render() {
    const { dates, editingDate, renderForm } = this.state

    return (
      <div className="card">
        {dates.map((date, index) => {
          const startDate = moment(date.start_date)
          const endDate = moment(date.end_date)
          return (
            <div key={index} className="card-item py-3 px-2 media">
              <JobIcon name="event" className="tc-primary-500" />
              <div className="media-body">
                <span className="btn-group float-right">
                  <button
                    type="button"
                    onClick={() => this.editDate(index)}
                    className="btn btn--size-1 btn-default"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => this.removeDate(index)}
                    className="btn btn--size-1 btn-default tc-error"
                  >
                    Remover
                  </button>
                </span>
                <p className="ts-small tw-medium mb-0 tc-muted-dark">
                  {startDate.format('L')}
                </p>
                <h5 className="tw-normal ts-medium mb-1">{date.name}</h5>
                <span className="tc-muted ts-small">
                  {startDate.format('LT')} <Icon name="chevron_right" />{' '}
                  {endDate.format('LT')}
                </span>
              </div>
            </div>
          )
        })}
        <div className="card-item p-3">
          {editingDate || dates.length === 0 || renderForm ? (
            <DisponibilityJobDateForm
              onCancel={this.handleCancel}
              onSubmit={this.handleFormSubmit}
              defaultValue={editingDate}
            />
          ) : (
            <button className="btn btn-primary" onClick={this.enableForm}>
              <Icon name="add" className="mr-1" />
              Adicionar data
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default DisponibilityJobForm
