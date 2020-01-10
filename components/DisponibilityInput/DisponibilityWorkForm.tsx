import isEqual from 'fast-deep-equal'
import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import MaskedTextInput from 'react-text-mask'
import * as masks from '~/lib/form/masks'
import Yup from '~/lib/form/yup'
import FormGroup from '../Form/FormGroup'
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

export interface Values {
  description: string
  weekly_hours: string | number
}

interface DisponibilityWorkFormProps {
  readonly defaultValue?: Values
  readonly onBlur: () => any
  readonly isDonation: boolean
  readonly onChange: (newValue: {
    description: string
    weekly_hours: number
  }) => any
}

const { HORARIOS_DICA, DESCRICAO_HORARIOS, HORAS_SEMANAIS } = defineMessages({
  DESCRICAO_HORARIOS: {
    id: 'DESCRICAO_HORARIOS',
    defaultMessage: 'Descrição dos horários',
  },
  HORARIOS_DICA: {
    id: 'HORARIOS_DICA',
    defaultMessage:
      'Descreva os horários em que o projeto poderá ser realizado pelos voluntários',
  },
  HORAS_SEMANAIS: {
    id: 'HORAS_SEMANAIS',
    defaultMessage: 'Horas semanais',
  },
})

class DisponibilityWorkForm extends React.PureComponent<
  InjectedFormikProps<DisponibilityWorkFormProps, Values> & WithIntlProps<any>
> {
  public componentDidUpdate(
    oldProps: InjectedFormikProps<DisponibilityWorkFormProps, Values>,
  ) {
    const { onChange, values } = this.props
    if (!isEqual(values, oldProps.values)) {
      onChange({
        description: values.description,
        weekly_hours: parseInt(values.weekly_hours as string, 10),
      })
    }
  }

  public handleBlur = (event: React.FocusEvent) => {
    this.props.handleBlur(event)
    this.props.onBlur()
  }

  public render() {
    const {
      intl,
      handleChange,
      touched,
      errors,
      values,
      isDonation,
    } = this.props

    return (
      <>
        <FormGroup
          hint={intl.formatMessage(HORARIOS_DICA)}
          label={intl.formatMessage(DESCRICAO_HORARIOS)}
          className="mb-4"
          error={touched.description ? errors.description : undefined}
        >
          <textarea
            name="description"
            className="input"
            onChange={handleChange}
            onBlur={this.handleBlur}
            value={values.description}
          />
        </FormGroup>
        {!isDonation && (
          <FormGroup
            label={intl.formatMessage(HORAS_SEMANAIS)}
            error={touched.weekly_hours ? errors.weekly_hours : undefined}
          >
            <MaskedTextInput
              name="weekly_hours"
              type="text"
              className="input w-1/2"
              onChange={handleChange}
              onBlur={this.handleBlur}
              mask={masks.numeral}
              value={values.weekly_hours}
            />
          </FormGroup>
        )}
      </>
    )
  }
}

const DisponibilityWorkFormSchema = Yup.object().shape({
  description: Yup.string()
    .min(4)
    .max(500)
    .required(),
  weekly_hours: Yup.number()
    .min(1)
    .max(1000)
    .required(),
})

export default withIntl(
  withFormik<DisponibilityWorkFormProps, Values>({
    displayName: 'DisponibilityWorkForm',
    validationSchema: DisponibilityWorkFormSchema,
    mapPropsToValues: ({ defaultValue, isDonation }) => ({
      description: (defaultValue && defaultValue.description) || '',
      weekly_hours: isDonation
        ? '10'
        : (defaultValue && defaultValue.weekly_hours) || '0',
    }),
    handleSubmit: () => {
      // ...
    },
  })(DisponibilityWorkForm),
)
