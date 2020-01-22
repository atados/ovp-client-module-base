import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { JobDate } from '~/redux/ducks/project'
import Icon from '../Icon'
import DisponibilityJobDateForm from './DisponibilityJobDateForm'
import { withIntl } from '~/lib/intl'
import { defineMessages, WithIntlProps } from 'react-intl'

const JobIcon = styled(Icon)`
  font-size: 24px;
  margin-right: 14px;
`

const m = defineMessages({
  addDate: {
    id: 'disponibilityJobform.addDate',
    defaultMessage: 'Adicionar data',
  },
  edit: {
    id: 'disponibilityJobform.edit',
    defaultMessage: 'Editar data',
  },
  remove: {
    id: 'disponibilityJobform.remove',
    defaultMessage: 'Remover data',
  },
})

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
  DisponibilityJobFormProps & WithIntlProps<any>,
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
    const { intl } = this.props
    const { dates, editingDate, renderForm } = this.state

    return (
      <div className="card">
        {dates.map((date, index) => {
          const startDate = moment(date.start_date)
          const endDate = moment(date.end_date)
          return (
            <div key={index} className="card-item py-4 px-3 media">
              <JobIcon name="event" className="text-primary-500" />
              <div className="media-body">
                <span className="btn-group float-right">
                  <button
                    type="button"
                    onClick={() => this.editDate(index)}
                    className="btn btn--size-1 btn-default"
                  >
                    {intl.formatMessage(m.edit)}
                  </button>
                  <button
                    type="button"
                    onClick={() => this.removeDate(index)}
                    className="btn btn--size-1 btn-default text-red-600"
                  >
                    {intl.formatMessage(m.remove)}
                  </button>
                </span>
                <p className="text-sm font-medium mb-0 text-gray-700">
                  {startDate.format('L')}
                </p>
                <h5 className="font-normal text-lg mb-1">{date.name}</h5>
                <span className="text-gray-600 text-sm">
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
            <button className="btn text-white bg-primary-500 hover:bg-primary-600" onClick={this.enableForm}>
              <Icon name="add" className="mr-1" />
              {intl.formatMessage(m.addDate)}
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default withIntl(DisponibilityJobForm)
