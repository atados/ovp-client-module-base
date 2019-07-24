import { InjectedFormikProps, withFormik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import FormGroup from '~/components/Form/FormGroup'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import HelpCard from '~/components/HelpCard'
import MarkdownEditor from '~/components/MarkdownEditor'
import asFormStep, {
  InjectedMultipleStepsFormProps,
} from '~/components/MultipleStepsForm/as-form-step'
import Yup from '~/lib/form/yup'

const ProjectAboutFormSchema = Yup.object().shape({
  body: Yup.string()
    .min(8)
    .max(3000)
    .required(),
})

export interface Values {
  readonly body: string
}

interface ProjectComposerAboutProps
  extends InjectedMultipleStepsFormProps<any, any, any> {
  readonly className?: string
}

const ProjectComposerAbout: React.FC<
  InjectedFormikProps<ProjectComposerAboutProps, Values>
> = ({
  className,
  isValid,
  errors,
  values,
  touched,
  handleSubmit,
  isFormSubmitting,
  setFieldValue,
  setFieldTouched,
  formContext: { mode },
}) => {
  const [renderEditor, setRenderEditor] = useState(false)
  useEffect(() => {
    setRenderEditor(true)
  }, [])
  const handleChange = useCallback(
    newValue => {
      setFieldValue('body', newValue)
    },
    [setFieldValue],
  )
  const handleBlur = useCallback(() => {
    setFieldTouched('body', true)
  }, [setFieldTouched])

  return (
    <FormComposerLayout
      disabled={!isValid}
      onSubmit={handleSubmit}
      className={className}
      isSubmitting={isFormSubmitting}
      helpPanelChildren={
        <div className="p-5">
          <HelpCard className="card pr-4 pb-4 pl-4 pt-2 mb-4">
            <h4 className="ts-medium tw-medium">O que não pode faltar!</h4>
            <ul className="bullets">
              <li>Descreva as atividades que o voluntário (a) irá realizar;</li>
              <li>Importância da ação;</li>
              <li>Público que será atendido pelo voluntariado;</li>
              <li>Se houver capacitação, é importante mencionar;</li>
            </ul>
          </HelpCard>
        </div>
      }
    >
      {mode !== FormComposerMode.EDIT && (
        <h4 className="tc-muted ts-small">ETAPA 4</h4>
      )}
      <h1 className="tw-light mb-1">Sobre a Vaga</h1>
      <p className="ts-medium tc-muted-dark mb-4">
        Descreva com clareza a finalidade da vaga.
      </p>

      <FormGroup
        labelFor="ong-input-body"
        error={touched.body ? errors.body : undefined}
        className="mb-4"
        length={values.body.length}
        maxLength={3000}
        hint="Você pode adicionar links e formatações ao texto."
      >
        {renderEditor && (
          <MarkdownEditor
            // @ts-ignore
            placeholder={
              <>
                Faça uma descrição completa e deixa um bom convite. <br /> Isso
                garante que mais voluntários se candidatem a esta vaga.
              </>
            }
            onChange={handleChange}
            onBlur={handleBlur}
            defaultValue={values.body}
          />
        )}
      </FormGroup>
    </FormComposerLayout>
  )
}

ProjectComposerAbout.displayName = 'ProjectComposerAbout'

export default asFormStep(
  'sobre',
  {
    label: 'Sobre a vaga',
    isDone: (value: any) =>
      ProjectAboutFormSchema.isValidSync({ body: value && value.details }),
  },
  withFormik<ProjectComposerAboutProps, Values>({
    displayName: 'ProjectComposerAboutForm',
    handleSubmit: (values, { props: { onSubmit } }) => {
      onSubmit(project => ({ ...project, details: values.body }))
    },
    isInitialValid: ({ value }: ProjectComposerAboutProps) =>
      value
        ? ProjectAboutFormSchema.isValidSync({ body: value.details || '' })
        : false,
    validationSchema: ProjectAboutFormSchema,
    mapPropsToValues: ({ value }) => ({
      body: (value && value.details) || '',
    }),
  })(ProjectComposerAbout),
)
