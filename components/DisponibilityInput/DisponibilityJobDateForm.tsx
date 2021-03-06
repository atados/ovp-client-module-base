import { InjectedFormikProps, withFormik } from 'formik'
import moment from 'moment'
import React from 'react'
import MaskedTextInput from 'react-text-mask'
import * as masks from '~/lib/form/masks'
import { RE_DATE, RE_HOUR } from '~/lib/form/regex'
import Yup, { YupDateErrorMessage, YupHourErrorMessage } from '~/lib/form/yup'
import { JobDate } from '~/redux/ducks/project'
import FormGroup from '../Form/FormGroup'
import { useIntl, defineMessages } from 'react-intl'

interface Values {
  name: string
  date: string
  start_hour: string
  end_hour: string
}

const m = defineMessages({
  date: {
    id: 'disponibilityJobDate.date',
    defaultMessage: 'Dia',
  },
  startHour: {
    id: 'disponibilityJobDate.startHour',
    defaultMessage: 'Início',
  },
  endHour: {
    id: 'disponibilityJobDate.endHour',
    defaultMessage: 'Término',
  },
  eventName: {
    id: 'disponibilityJobDate.eventName',
    defaultMessage: 'Evento do dia',
  },
  submit: {
    id: 'disponibilityJobDate.submit',
    defaultMessage: 'Adicionar',
  },
  cancel: {
    id: 'disponibilityJobDate.cancel',
    defaultMessage: 'Cancelar',
  },
})

interface DisponibilityJobDateFormProps {
  readonly className?: string
  readonly defaultValue?: JobDate
  readonly onSubmit: (date: JobDate) => any
  readonly onCancel: () => any
}

const DisponibilityJobDateForm: React.FC<InjectedFormikProps<
  DisponibilityJobDateFormProps,
  Values
>> = ({
  onCancel,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
}) => {
  const intl = useIntl()
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full md:w-4/12">
          <FormGroup
            label={intl.formatMessage(m.date)}
            className="mb-4"
            error={touched.date ? errors.date : undefined}
          >
            <MaskedTextInput
              name="date"
              type="text"
              className="input"
              placeholder="__/__/____"
              mask={masks.date}
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormGroup>
        </div>
        <div className="w-full md:w-3/12">
          <FormGroup
            label={intl.formatMessage(m.startHour)}
            className="mb-4"
            error={touched.start_hour ? errors.start_hour : undefined}
          >
            <MaskedTextInput
              name="start_hour"
              type="text"
              className="input"
              placeholder="__:__"
              mask={masks.hour}
              value={values.start_hour}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormGroup>
        </div>
        <div className="w-full md:w-3/12">
          <FormGroup
            label={intl.formatMessage(m.endHour)}
            className="mb-4"
            error={touched.end_hour ? errors.end_hour : undefined}
          >
            <MaskedTextInput
              name="end_hour"
              type="text"
              className="input"
              placeholder="__:__"
              mask={masks.hour}
              value={values.end_hour}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormGroup>
        </div>
      </div>
      <FormGroup
        label={intl.formatMessage(m.eventName)}
        className="mb-4"
        error={touched.name ? errors.name : undefined}
      >
        <input
          name="name"
          type="text"
          className="input"
          placeholder="Ex.: Capacitação"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <button
        type="button"
        onClick={() => handleSubmit()}
        className="btn text-white bg-primary-500 hover:bg-primary-600 btn--size-2 mr-2"
      >
        {intl.formatMessage(m.submit)}
      </button>
      <button
        onClick={onCancel}
        type="button"
        className="btn btn-text text-gray-700 btn--size-2"
      >
        {intl.formatMessage(m.cancel)}
      </button>
    </>
  )
}

DisponibilityJobDateForm.displayName = 'DisponibilityJobDateForm'

const DisponibilityJobDateFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .max(20)
    .required(),
  date: Yup.string()
    .matches(RE_DATE, YupDateErrorMessage)
    .required(),
  start_hour: Yup.string()
    .matches(RE_HOUR, YupHourErrorMessage)
    .required(),
  end_hour: Yup.string()
    .matches(RE_HOUR, YupHourErrorMessage)
    .test(
      'is-greater-than-start',
      'A data de término deve ser maior que a de início',
      function(value) {
        const startHour = this.parent.start_hour

        return value > startHour
      },
    )
    .required(),
})

export default withFormik<DisponibilityJobDateFormProps, Values>({
  validationSchema: DisponibilityJobDateFormSchema,
  mapPropsToValues: ({ defaultValue }) => {
    if (defaultValue) {
      const startDate = moment(defaultValue.start_date)
      const endDate = moment(defaultValue.end_date)
      return {
        name: defaultValue.name,
        date: startDate.format('L'),
        start_hour: startDate.format('LT'),
        end_hour: endDate.format('LT'),
      }
    }

    return {
      name: '',
      date: '',
      start_hour: '',
      end_hour: '',
    }
  },
  handleSubmit: (values, { setFieldError, props: { onSubmit } }) => {
    const [day, month, year] = values.date.split('/')
    const startDate = new Date(`${month}/${day}/${year}`)

    // Check if date is at least three days from now
    if (Date.now() > startDate.getTime() + 86400) {
      setFieldError('date', 'A data deve ser no minímo daqui a 3 dias')
      return
    }

    const endDate = new Date(`${month}/${day}/${year}`)
    startDate.setSeconds(0)
    endDate.setSeconds(0)

    const [startHour, startMinutes] = values.start_hour.split(':')

    startDate.setHours(parseInt(startHour, 10))
    startDate.setMinutes(parseInt(startMinutes, 10))

    const [endHour, endMinutes] = values.end_hour.split(':')
    endDate.setHours(parseInt(endHour, 10))
    endDate.setMinutes(parseInt(endMinutes, 10))

    onSubmit({
      name: values.name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })
  },
})(DisponibilityJobDateForm)
