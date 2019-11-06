import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import MaskedTextInput from 'react-text-mask'
import FormGroup from '~/components/Form/FormGroup'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import HelpCard from '~/components/HelpCard'
import * as masks from '~/lib/form/masks'
import { RE_PHONE } from '~/lib/form/regex'
import Yup, { YupPhoneErrorMessage } from '~/lib/form/yup'
import { ensureHttpsUri } from '~/lib/utils/string'
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

const OrganizationContactFormSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(RE_PHONE, YupPhoneErrorMessage)
    .required(),
  contact_email: Yup.string()
    .email()
    .required(),
  website: Yup.string().url(),
  facebook_page: Yup.string().url(),
})

export interface Values {
  readonly phone: string
  readonly website: string
  readonly contact_email: string
  readonly facebook_page: string
}

interface OrganizationComposerContactProps {
  readonly className?: string
  readonly mode: FormComposerMode
  readonly isComposerSubmitting?: boolean
  readonly onBack?: () => void
  readonly onSubmit: (values: Values) => void
  readonly onChange: (values: Values) => void
  readonly defaultValue?: Values
}

const {
  A_COMUNICACAO,
  FUNDAMENTAL,
  ETAPA2,
  CONTATO,
  PREENCHA,
  EMAIL,
  EMAIL_HINT,
} = defineMessages({
  A_COMUNICACAO: {
    id: 'A_COMUNICACAO',
    defaultMessage: 'A comunicação é fudamental',
  },
  FUNDAMENTAL: {
    id: 'FUNDAMENTAL',
    defaultMessage:
      'É fudamental que os dados estejam corretos para que os voluntários possam entrar em contato após a inscrição.',
  },
  ETAPA2: {
    id: 'ETAPA2',
    defaultMessage: 'ETAPA 2',
  },
  CONTATO: {
    id: 'CONTATO',
    defaultMessage: 'Contato',
  },
  PREENCHA: {
    id: 'PREENCHA',
    defaultMessage: 'Preencha as informações de contato da ONG',
  },
  EMAIL: {
    id: 'EMAIL',
    defaultMessage: 'Email de contato da ONG',
  },
  EMAIL_HINT: {
    id: 'EMAIL_HINT',
    defaultMessage: 'Use um email de contato ativo',
  },
})

class OrganizationComposerContact extends React.Component<
  OrganizationComposerContactProps &
    InjectedFormikProps<OrganizationComposerContactProps, Values> &
    WithIntlProps<any>
> {
  public static isValidValue = (values: Values): Promise<boolean> => {
    return OrganizationContactFormSchema.isValid(values)
  }

  public draftTimeout: number
  public handleBlur = (event: React.FocusEvent) => {
    const { handleBlur } = this.props
    handleBlur(event)
    this.saveDraft()
  }

  public saveDraft = () => {
    const { onChange } = this.props

    if (this.draftTimeout) {
      clearTimeout(this.draftTimeout)
    }

    this.draftTimeout = window.setTimeout(() => {
      onChange(this.props.values)
    }, 1000)
  }

  public render() {
    const {
      className,
      handleChange,
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

    return (
      <FormComposerLayout
        disabled={!isValid}
        onSubmit={handleSubmit}
        mode={mode}
        className={className}
        onBack={onBack}
        isSubmitting={isComposerSubmitting}
        helpPanelChildren={
          <div className="p-5">
            <HelpCard className="card pr-4 pb-4 pl-4 pt-2">
              <h4 className="ts-medium tw-medium">
                {intl.formatMessage(A_COMUNICACAO)}
              </h4>
              <p className="tc-muted-dark mb-0">
                {intl.formatMessage(FUNDAMENTAL)}
              </p>
            </HelpCard>
          </div>
        }
      >
        {mode !== FormComposerMode.EDIT && (
          <h4 className="tc-muted ts-small">{intl.formatMessage(ETAPA2)}</h4>
        )}
        <h1 className="tw-light mb-1">{intl.formatMessage(CONTATO)}</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          {intl.formatMessage(PREENCHA)}
        </p>

        <FormGroup
          labelFor="ong-input-phone"
          label="Telefone"
          error={touched.phone ? errors.phone : undefined}
          className="mb-4"
        >
          <MaskedTextInput
            id="ong-input-phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            mask={masks.phone}
            placeholder="(__) ____-____"
            guide={false}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-email"
          label={intl.formatMessage(EMAIL)}
          error={touched.contact_email ? errors.contact_email : undefined}
          className="mb-4"
          hint={intl.formatMessage(EMAIL_HINT)}
        >
          <input
            id="ong-input-email"
            name="contact_email"
            value={values.contact_email}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            placeholder="ong@contato.com.br"
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-website"
          label="Website"
          error={touched.website ? errors.website : undefined}
          className="mb-4"
          required={false}
        >
          <input
            id="ong-input-website"
            name="website"
            value={values.website}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            placeholder="https://site-da-ong.com.br"
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-facebook_page"
          label="Facebook"
          error={touched.facebook_page ? errors.facebook_page : undefined}
          className="mb-4"
          required={false}
        >
          <input
            id="ong-input-facebook_page"
            name="facebook_page"
            value={values.facebook_page}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            placeholder="https://facebook.com/ong"
          />
        </FormGroup>
      </FormComposerLayout>
    )
  }
}

const defaultValue: Values = {
  phone: '',
  website: '',
  contact_email: '',
  facebook_page: '',
}

export default withFormik<OrganizationComposerContactProps, Values>({
  displayName: 'OrganizationComposerContactForm',
  handleSubmit: (values, { props: { onSubmit } }) => {
    onSubmit({
      ...values,
      facebook_page: ensureHttpsUri(values.facebook_page),
      website: ensureHttpsUri(values.website),
    })
  },
  isInitialValid: (props: OrganizationComposerContactProps) =>
    props.defaultValue
      ? OrganizationContactFormSchema.isValidSync(props.defaultValue)
      : false,
  validationSchema: OrganizationContactFormSchema,
  mapPropsToValues: ({ defaultValue: value = defaultValue }) => ({
    phone: value.phone || '',
    website: value.website || '',
    contact_email: value.contact_email || '',
    facebook_page: value.facebook_page || '',
  }),
})(withIntl(OrganizationComposerContact))
