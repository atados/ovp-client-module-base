import { InjectedFormikProps, withFormik } from 'formik'
import * as React from 'react'
import MaskedTextInput from 'react-text-mask'
import Textarea from 'react-textarea-autosize'
import FormGroup from '~/components/Form/FormGroup'
import * as masks from '~/lib/form/masks'
import Yup from '~/lib/form/yup'

interface Values {
  name: string
  details: string
  prerequisites: string
  vacancies: string
}

interface RoleFormProps {
  readonly className?: string
  readonly onRemove?: () => any
  readonly defaultValue?: {
    name: string
    details: string
    prerequisites: string
    vacancies: number
  }
  readonly onSubmit: (role: {
    name: string
    details: string
    prerequisites: string
    vacancies: number
  }) => any
}

const RoleForm: React.SFC<InjectedFormikProps<RoleFormProps, Values>> = ({
  defaultValue,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  onRemove,
}) => (
  <form onSubmit={handleSubmit}>
    <h4 className="tw-normal">
      {defaultValue ? 'Editando' : 'Adicionar'} função
    </h4>
    <hr />
    <FormGroup
      label="Nome da função"
      className="mb-3"
      length={values.name.length}
      maxLength={150}
      error={touched.name ? errors.name : undefined}
    >
      <input
        name="name"
        type="text"
        className="input"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormGroup>
    <FormGroup
      label="Descrição da função"
      className="mb-3"
      length={values.details.length}
      maxLength={300}
      error={touched.details ? errors.details : undefined}
    >
      <Textarea
        minRows={3}
        name="details"
        type="text"
        className="input"
        value={values.details}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormGroup>
    <FormGroup
      label="Pré-requisitos"
      className="mb-3"
      length={values.prerequisites.length}
      maxLength={150}
      error={touched.prerequisites ? errors.prerequisites : undefined}
    >
      <input
        name="prerequisites"
        type="text"
        className="input"
        value={values.prerequisites}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormGroup>
    <FormGroup
      label="Número de vagas"
      className="mb-3"
      error={touched.vacancies ? errors.vacancies : undefined}
    >
      <MaskedTextInput
        name="vacancies"
        type="text"
        className="input w-50"
        mask={masks.numeral}
        value={values.vacancies}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormGroup>
    <button
      type="button"
      className="btn btn-primary btn--block btn--size-3 mb-2 btn--strong"
      onClick={() => handleSubmit()}
    >
      {defaultValue ? 'Salvar' : 'Adicionar'}
    </button>
    {defaultValue && (
      <>
        <hr />
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-default tc-error btn--block btn--size-3"
        >
          Remover função
        </button>
      </>
    )}
  </form>
)

RoleForm.displayName = 'RoleForm'

const RoleFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .max(50)
    .required(),
  details: Yup.string()
    .min(4)
    .max(500)
    .required(),
  prerequisites: Yup.string()
    .min(4)
    .max(150)
    .required(),
  vacancies: Yup.number()
    .min(1)
    .max(1000)
    .required(),
})

export default withFormik<RoleFormProps, Values>({
  mapPropsToValues: ({ defaultValue }) => ({
    name: (defaultValue && defaultValue.name) || '',
    details: (defaultValue && defaultValue.details) || '',
    prerequisites: (defaultValue && defaultValue.prerequisites) || '',
    vacancies: (defaultValue && String(defaultValue.vacancies)) || '',
  }),
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit({
      ...values,
      vacancies: parseInt(values.vacancies, 10),
    })
  },
  validationSchema: RoleFormSchema,
})(RoleForm)
