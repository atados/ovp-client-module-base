import isEqual from 'fast-deep-equal'
import { InjectedFormikProps, withFormik } from 'formik'
import * as React from 'react'
import MaskedTextInput from 'react-text-mask'
import * as masks from '~/lib/form/masks'
import Yup from '~/lib/form/yup'
import FormGroup from '../Form/FormGroup'

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

class DisponibilityWorkForm extends React.PureComponent<
  InjectedFormikProps<DisponibilityWorkFormProps, Values>
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
    const { handleChange, touched, errors, values, isDonation } = this.props

    return (
      <>
        <FormGroup
          hint="Descreva os horários em que o projeto poderá ser realizado pelos voluntários"
          label={
            isDonation
              ? 'Descrição dos horários para doar'
              : 'Descrição dos horários'
          }
          className="mb-3"
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
            label="Horas semanais"
            error={touched.weekly_hours ? errors.weekly_hours : undefined}
          >
            <MaskedTextInput
              name="weekly_hours"
              type="text"
              className="input w-50"
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

export default withFormik<DisponibilityWorkFormProps, Values>({
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
})(DisponibilityWorkForm)
