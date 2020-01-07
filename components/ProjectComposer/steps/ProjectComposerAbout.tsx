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
import { defineMessages, FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const MarkdownEditorFormGroup = styled(FormGroup)`
  .max-length-indicator {
    top: 10px;
    right: 0;
  }
`

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

const {
  NAO_PODE,
  DESCREVA,
  IMPORTANCIA,
  PUBLICO,
  SE_HOUVER,
  ETAPA4,
  SOBRE,
  DESCREVA_CLAREZA,
  HINT,
  PLACEHOLDER,
} = defineMessages({
  NAO_PODE: {
    id: 'NAO_PODE',
    defaultMessage: 'O que não pode faltar!',
  },
  DESCREVA: {
    id: 'DESCREVA',
    defaultMessage: 'Descreva as atividades que o voluntário (a) irá realizar;',
  },
  IMPORTANCIA: {
    id: 'IMPORTANCIA',
    defaultMessage: 'Importância da ação;',
  },
  PUBLICO: {
    id: 'PUBLICO',
    defaultMessage: 'Público que será atendido pelo voluntariado;',
  },
  SE_HOUVER: {
    id: 'SE_HOUVER',
    defaultMessage: 'Se houver capacitação, é importante mencionar;',
  },
  ETAPA4: {
    id: 'ETAPA4',
    defaultMessage: 'ETAPA 4',
  },
  SOBRE: {
    id: 'SOBRE',
    defaultMessage: 'Sobre a Vaga',
  },
  DESCREVA_CLAREZA: {
    id: 'DESCREVA_CLAREZA',
    defaultMessage: 'Descreva com clareza a finalidade da vaga.',
  },
  HINT: {
    id: 'HINT',
    defaultMessage: 'Você pode adicionar links e formatações ao texto.',
  },
  PLACEHOLDER: {
    id: 'PLACEHOLDER',
    defaultMessage: 'Faça uma descrição completa e deixa um bom convite.',
  },
})

const ProjectComposerAbout: React.FC<InjectedFormikProps<
  ProjectComposerAboutProps,
  Values
>> = ({
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
  const intl = useIntl()
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
          <HelpCard className="card pr-5 pb-5 pl-5 pt-3 mb-6">
            <h4 className="text-lg font-medium">
              {intl.formatMessage(NAO_PODE)}
            </h4>
            <ul className="bullets">
              <li>{intl.formatMessage(DESCREVA)}</li>
              <li>{intl.formatMessage(IMPORTANCIA)}</li>
              <li>{intl.formatMessage(PUBLICO)}</li>
              <li>{intl.formatMessage(SE_HOUVER)}</li>
            </ul>
          </HelpCard>
        </div>
      }
    >
      {mode !== FormComposerMode.EDIT && (
        <h4 className="text-gray-600 text-sm">{intl.formatMessage(ETAPA4)}</h4>
      )}
      <h1 className="font-light mb-1">{intl.formatMessage(SOBRE)}</h1>
      <p className="text-lg text-gray-700 mb-6">
        {intl.formatMessage(DESCREVA_CLAREZA)}
      </p>

      <MarkdownEditorFormGroup
        labelFor="ong-input-body"
        error={touched.body ? errors.body : undefined}
        className="mb-6 relative"
        length={values.body.length}
        maxLength={3000}
        maxLengthClassName="max-length-indicator absolute"
        hint={intl.formatMessage(HINT)}
      >
        {renderEditor && (
          <MarkdownEditor
            // @ts-ignore
            placeholder={<>{intl.formatMessage(PLACEHOLDER)}</>}
            onChange={handleChange}
            onBlur={handleBlur}
            defaultValue={values.body}
          />
        )}
      </MarkdownEditorFormGroup>
    </FormComposerLayout>
  )
}

ProjectComposerAbout.displayName = 'ProjectComposerAbout'

export default asFormStep(
  'sobre',
  {
    label: () => (
      <FormattedMessage
        id="projectComposerAbout.stepTitle"
        defaultMessage="Sobre a vaga"
      />
    ),
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
