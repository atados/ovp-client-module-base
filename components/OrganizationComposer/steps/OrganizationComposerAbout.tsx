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

class OrganizationComposerContact extends React.Component<
  OrganizationComposerContactProps &
    InjectedFormikProps<OrganizationComposerContactProps, Values>,
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
    } = this.props
    const { renderEditor } = this.state

    return (
      <FormComposerLayout
        disabled={!isValid}
        onSubmit={handleSubmit}
        className={className}
        onBack={onBack}
        isSubmitting={isComposerSubmitting}
        helpPanelChildren={
          <div className="p-5">
            <HelpCard className="card pr-4 pb-4 pl-4 pt-2">
              <h4 className="ts-medium tw-medium">
                Dicas para uma boa descrição
              </h4>
              <p className="tc-muted-dark mb-0">
                Para ter uma descrição completa certifique-se de que o texto
                contempla os seguinte pontos:
                <br />
                <br />
                1. A história da ONG;
                <br />
                2. O público atendido;
                <br />
                3. Atividades e projetos desenvolvidos;
                <br />
                4. A importância do trabalho da ONG.
              </p>
            </HelpCard>
          </div>
        }
      >
        {mode !== FormComposerMode.EDIT && (
          <h4 className="tc-muted ts-small">ETAPA 3</h4>
        )}
        <h1 className="tw-light mb-1">Sobre a ONG</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          Descreva com clareza o trabalho da ONG.
        </p>

        <FormGroup
          labelFor="ong-input-content"
          error={touched.content ? errors.content : undefined}
          className="mb-4"
          length={values.content.length}
          maxLength={3000}
        >
          {renderEditor && (
            <MarkdownEditor
              placeholder="Escreva sobre o que sua ONG faz, como ela começou, histórias..."
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              defaultValue={values.content}
            />
          )}
        </FormGroup>
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
})(OrganizationComposerContact)
