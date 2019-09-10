import { InjectedFormikProps, withFormik } from 'formik'
import React, { useCallback } from 'react'
import DisponibilityInput from '~/components/DisponibilityInput'
import { DisponibilityInputValue } from '~/components/DisponibilityInput/DisponibilityInput'
import FormGroup from '~/components/Form/FormGroup'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import asFormStep, {
  InjectedMultipleStepsFormProps,
} from '~/components/MultipleStepsForm/as-form-step'
import Yup from '~/lib/form/yup'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

const ProjectDisponibilityFormSchema = Yup.object().shape({
  disponibility: Yup.object()
    .shape({
      type: Yup.string()
        .oneOf(['job', 'work'])
        .required(),
      work: Yup.object()
        .shape({
          description: Yup.string()
            .min(4)
            .max(500)
            .required(),
          weekly_hours: Yup.number()
            .min(1)
            .max(1000)
            .required(),
        })
        .nullable(true),
      job: Yup.object()
        .shape({
          dates: Yup.array()
            .of(
              Yup.object().shape({
                name: Yup.string().required(),
                start_date: Yup.string().required(),
                end_date: Yup.string().required(),
              }),
            )
            .min(1),
        })
        .nullable(true),
    })
    .required(),
})

const {
  ETAPA2,
  DISPONIBILIDADE,
  PREENCHA_INFORMACOES,
  PREENCHA_CAMPOS,
  INSIRA_DATA,
  VAGA_DISTANCIA,
  MARQUE_CASO,
} = defineMessages({
  ETAPA2: {
    id: 'ETAPA2',
    defaultMessage: 'ETAPA 2',
  },
  DISPONIBILIDADE: {
    id: 'DISPONIBILIDADE',
    defaultMessage: 'Disponibilidade',
  },
  PREENCHA_INFORMACOES: {
    id: 'PREENCHA_INFORMACOES',
    defaultMessage:
      'Preencha as informações de data e comparecimento do voluntário na vaga',
  },
  PREENCHA_CAMPOS: {
    id: 'PREENCHA_CAMPOS',
    defaultMessage: 'Preencha todos os campos',
  },
  INSIRA_DATA: {
    id: 'INSIRA_DATA',
    defaultMessage: 'Insira ao menos uma data',
  },
  VAGA_DISTANCIA: {
    id: 'VAGA_DISTANCIA',
    defaultMessage: 'Essa vaga pode ser feita a distância',
  },
  MARQUE_CASO: {
    id: 'MARQUE_CASO',
    defaultMessage: 'Marque caso essa vaga aceita voluntários remotos',
  },
})

export interface Values {
  readonly disponibility: DisponibilityInputValue
  readonly canBeDoneRemotely: boolean
  readonly canHaveMinors: boolean
}

interface ProjectComposerDisponibilityProps
  extends InjectedMultipleStepsFormProps<any, any, any> {
  readonly className?: string
}

const ProjectComposerDisponibility: React.FC<
  InjectedFormikProps<ProjectComposerDisponibilityProps, Values>
> = ({
  className,
  handleChange,
  isValid,
  errors,
  values,
  touched,
  handleSubmit,
  handleBlur,
  isFormSubmitting,
  setFieldValue,
  setFieldTouched,
  formContext: { mode },
}) => {
  const handleDisponibilityChange = useCallback(newValue => {
    setFieldValue('disponibility', {
      type: newValue.type,
      job: newValue.job || null,
      work: newValue.work || null,
    })
  }, [])
  const handleDisponibilityBlur = useCallback(() => {
    setFieldTouched('disponibility', true)
  }, [])
  const intl = useIntl()

  return (
    <FormComposerLayout
      disabled={!isValid}
      onSubmit={handleSubmit}
      className={className}
      isSubmitting={isFormSubmitting}
    >
      {mode !== FormComposerMode.EDIT && (
        <h4 className="tc-muted ts-small">{intl.formatMessage(ETAPA2)}</h4>
      )}
      <h1 className="tw-light mb-1">{intl.formatMessage(DISPONIBILIDADE)}</h1>
      <p className="ts-medium tc-muted-dark mb-4">
        {intl.formatMessage(PREENCHA_INFORMACOES)}
      </p>

      <FormGroup
        error={
          touched.disponibility
            ? errors.disponibility
              ? (errors.disponibility as any).work
                ? intl.formatMessage(PREENCHA_CAMPOS)
                : intl.formatMessage(INSIRA_DATA)
              : undefined
            : undefined
        }
        className="mb-4"
      >
        <DisponibilityInput
          value={values.disponibility}
          onChange={handleDisponibilityChange}
          onBlur={handleDisponibilityBlur}
        />
      </FormGroup>
      <label htmlFor="ong-input-canBeDoneRemotely" className="mb-3">
        <div className="media">
          <input
            id="ong-input-canBeDoneRemotely"
            name="canBeDoneRemotely"
            type="checkbox"
            className="input mr-2"
            checked={values.canBeDoneRemotely}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="media-body">
            {intl.formatMessage(VAGA_DISTANCIA)}
            <span className="tc-muted block ts-tiny">
              {intl.formatMessage(MARQUE_CASO)}
            </span>
          </div>
        </div>
      </label>
    </FormComposerLayout>
  )
}

ProjectComposerDisponibility.displayName = 'ProjectComposerDisponibility'

export default asFormStep(
  'disponibilidade',
  {
    label: 'Disponibilidade',
    isDone: (value: any) => {
      return ProjectDisponibilityFormSchema.isValidSync({
        disponibility: value &&
          value.disponibility && {
            type: value.disponibility.type,
            work: value.disponibility.work || null,
            job: value.disponibility.job || null,
          },
      })
    },
  },

  withFormik<ProjectComposerDisponibilityProps, Values>({
    displayName: 'ProjectComposerDisponibilityForm',
    handleSubmit: (values, { props: { onSubmit } }) => {
      const { disponibility } = values

      if (!disponibility) {
        return
      }

      if (disponibility && disponibility.type === 'work') {
        disponibility.work.can_be_done_remotely = values.canBeDoneRemotely
      }

      onSubmit(project => ({
        ...project,
        disponibility:
          disponibility.type === 'work'
            ? { type: 'work', work: disponibility.work }
            : { type: 'job', job: disponibility.job },
        minimum_age: values.canHaveMinors ? 16 : undefined,
      }))
    },
    isInitialValid: ({ value }: ProjectComposerDisponibilityProps) =>
      value
        ? ProjectDisponibilityFormSchema.isValidSync({
            disponibility: value && value.disponibility,
          })
        : false,
    validationSchema: ProjectDisponibilityFormSchema,
    mapPropsToValues: ({ value }) => ({
      disponibility: (value && value.disponibility) || null,
      canHaveMinors: Boolean(
        value && value.minimum_age && value.minimum_age >= 16,
      ),
      canBeDoneRemotely: Boolean(
        value &&
          value.disponibility &&
          value.disponibility.type === 'work' &&
          value.disponibility.work.can_be_done_remotely,
      ),
    }),
  })(ProjectComposerDisponibility),
)
