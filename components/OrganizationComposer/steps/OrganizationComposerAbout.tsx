import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import FormGroup from '~/components/Form/FormGroup'
import {
  FormComposerMode,
  FormComposerStepProps,
} from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import HelpCard from '~/components/HelpCard'
import MarkdownEditor from '~/components/MarkdownEditor'
import Yup from '~/lib/form/yup'
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'
import styled from 'styled-components'

const MarkdownEditorFormGroup = styled(FormGroup)`
  .max-length-indicator {
    top: 10px;
    right: 0;
  }
`

const OrganizationContactFormSchema = Yup.object().shape({
  content: Yup.string()
    .min(8)
    .max(3000)
    .required(),
})

export interface Values {
  readonly content: string
}

interface OrganizationComposerContactProps
  extends FormComposerStepProps<Values> {
  readonly className?: string
}

interface OrganizationComposerState {
  renderEditor?: boolean
}

const {
  DICAS,
  DICAS_HEADER,
  DICA1,
  DICA2,
  DICA3,
  DICA4,
  SOBRE,
  ETAPA3,
  DESCREVA,
  ESCREVA,
} = defineMessages({
  DICAS: {
    id: 'DICAS',
    defaultMessage: 'Dicas para uma boa descrição',
  },
  DICAS_HEADER: {
    id: 'DICAS_HEADER',
    defaultMessage:
      'Para ter uma descrição completa certifique-se de que o texto contempla os seguinte pontos:',
  },
  DICA1: {
    id: 'DICA1',
    defaultMessage: '1. A história da ONG;',
  },
  DICA2: {
    id: 'DICA2',
    defaultMessage: '2. O público atendido;',
  },
  DICA3: {
    id: 'DICA3',
    defaultMessage: '3. Atividades e projetos desenvolvidos;',
  },
  DICA4: {
    id: 'DICA4',
    defaultMessage: '4. A importância do trabalho da ONG.',
  },
  SOBRE: {
    id: 'organizationComposerAbout.title',
    defaultMessage: 'Sobre a ONG',
  },
  ETAPA3: {
    id: 'ETAPA3',
    defaultMessage: 'ETAPA 3',
  },
  DESCREVA: {
    id: 'DESCREVA',
    defaultMessage: 'Descreva com clareza o trabalho da ONG.',
  },
  ESCREVA: {
    id: 'ESCREVA',
    defaultMessage:
      'Escreva sobre o que sua ONG faz, como ela começou, histórias...',
  },
})

class OrganizationComposerContact extends React.Component<
  OrganizationComposerContactProps &
    InjectedFormikProps<OrganizationComposerContactProps, Values> &
    WithIntlProps<any>,
  OrganizationComposerState
> {
  public static isValidValue = (values: Values): Promise<boolean> => {
    return OrganizationContactFormSchema.isValid(values)
  }
  public draftTimeout: number
  public state: OrganizationComposerState = {}

  public componentDidMount() {
    this.setState({ renderEditor: true })
  }

  public saveDraft = () => {
    const { onChange } = this.props

    if (this.draftTimeout) {
      clearTimeout(this.draftTimeout)
    }

    this.draftTimeout = window.setTimeout(() => {
      if (onChange) {
        onChange(this.props.values)
      }
    }, 1000)
  }

  public handleChange = (newValue: string) => {
    this.props.setFieldValue('content', newValue)
  }

  public handleBlur = () => {
    this.props.setFieldTouched('content', true)
    this.saveDraft()
  }

  public render() {
    const {
      className,
      isValid,
      errors,
      values,
      touched,
      mode,
      handleSubmit,
      onBack,
      isComposerSubmitting,
      intl,
    } = this.props
    const { renderEditor } = this.state

    return (
      <FormComposerLayout
        disabled={!isValid}
        onSubmit={handleSubmit}
        className={className}
        onBack={onBack}
        isSubmitting={isComposerSubmitting}
        mode={mode}
        helpPanelChildren={
          <div className="p-5">
            <HelpCard className="card pr-5 pb-5 pl-5 pt-3">
              <h4 className="text-lg font-medium">
                {intl.formatMessage(DICAS)}
              </h4>
              <p className="text-gray-700 mb-0">
                {intl.formatMessage(DICAS_HEADER)}
                <br />
                <br />
                {intl.formatMessage(DICA1)}
                <br />
                {intl.formatMessage(DICA2)}
                <br />
                {intl.formatMessage(DICA3)}
                <br />
                {intl.formatMessage(DICA4)}
              </p>
            </HelpCard>
          </div>
        }
      >
        {mode !== FormComposerMode.EDIT && (
          <h4 className="text-gray-600 text-sm">
            {intl.formatMessage(ETAPA3)}
          </h4>
        )}
        <h1 className="font-light mb-1">{intl.formatMessage(SOBRE)}</h1>
        <p className="text-lg text-gray-700 mb-6">
          {intl.formatMessage(DESCREVA)}
        </p>

        <MarkdownEditorFormGroup
          labelFor="ong-input-content"
          error={touched.content ? errors.content : undefined}
          className="mb-6 relative"
          length={values.content.length}
          maxLength={3000}
          maxLengthClassName="max-length-indicator absolute"
        >
          {renderEditor && (
            <MarkdownEditor
              placeholder={intl.formatMessage(ESCREVA)}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              defaultValue={values.content}
            />
          )}
        </MarkdownEditorFormGroup>
      </FormComposerLayout>
    )
  }
}

const defaultValue: Values = {
  content: '',
}

export default withFormik<OrganizationComposerContactProps, Values>({
  displayName: 'OrganizationComposerContactForm',
  handleSubmit: (values, { props: { onSubmit } }) => {
    onSubmit(values)
  },
  isInitialValid: (props: OrganizationComposerContactProps) =>
    props.defaultValue
      ? OrganizationContactFormSchema.isValidSync(props.defaultValue)
      : false,
  validationSchema: OrganizationContactFormSchema,
  mapPropsToValues: ({ defaultValue: value = defaultValue }) => ({
    content: value.content || '',
  }),
})(withIntl(OrganizationComposerContact))
