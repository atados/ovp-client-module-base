import React, { Dispatch } from 'react'
import cx from 'classnames'
import { withFormik, FormikProps } from 'formik'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { AuthenticationAction } from './Authentication'
import { useIntl, defineMessages } from 'react-intl'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { Asset, Page } from '~/base/common'
import InputAddress from '../InputAddress'
import { InputAddressValueType } from '../InputAddress/InputAddress'
import {
  createNewUser,
  generateSessionTokenWithEmail,
  User,
} from '~/base/redux/ducks/user'
import Status, { StatusLevel } from '../Status'

interface Values {
  name: string
  email: string
  city: InputAddressValueType
  password: string
}

interface AuthenticationEmailNewAccountProps {
  readonly className?: string
  readonly defaultValues?: Values
  readonly dispatch: Dispatch<AuthenticationAction>
  readonly onLogin: (user: User) => void
}

const m = defineMessages({
  title: {
    id: 'authentication.email.newAccount.title',
    defaultMessage: 'Nova conta',
  },
  subtitle: {
    id: 'authentication.email.newAccount.subtitle',
    defaultMessage:
      'Crie uma nova conta para se voluntariar, divulgar vagas de voluntariado e personalizar a página da sua ONG.',
  },
  submit: {
    id: 'authentication.email.newAccount.submit',
    defaultMessage: 'Continuar',
  },
  email: {
    id: 'authentication.email.newAccount.email',
    defaultMessage: 'Email',
  },
  emailPlaceholder: {
    id: 'authentication.email.newAccount.placeholder.email',
    defaultMessage: 'Email de acesso',
  },
  name: {
    id: 'authentication.email.newAccount.name',
    defaultMessage: 'Nome',
  },
  city: {
    id: 'authentication.email.newAccount.city',
    defaultMessage: 'Cidade',
  },
  password: {
    id: 'authentication.email.newAccount.password',
    defaultMessage: 'Senha',
  },
  optionsLink: {
    id: 'authentication.email.newAccount.optionsLink',
    defaultMessage: 'Ver todas opções de acesso',
  },
  addressHint: {
    id: 'ENDERECO_HINT',
    defaultMessage: 'Comece a escrever e selecione uma opção',
  },
})

const AuthenticationEmailNewAccount: React.FC<
  AuthenticationEmailNewAccountProps & FormikProps<Values>
> = ({
  className,
  values,
  touched,
  handleChange,
  handleSubmit,
  errors,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  dispatch,
  status,
}) => {
  const intl = useIntl()
  const handleOptionsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    dispatch({
      type: 'SetPage',
      payload: 'options',
    })
  }

  return (
    <form
      id="form-new-account"
      method="POST"
      className={cx('', className)}
      onSubmit={handleSubmit}
    >
      {status && status.error && (
        <Status level={StatusLevel.Error} message={status.error.message} />
      )}
      <div className="max-w-sm mx-auto">
        <div className="ta-center">
          <img
            src={Asset.Logo}
            alt=""
            width="42"
            height="42"
            className="block mx-auto"
          />
          <h1 className="h2">{intl.formatMessage(m.title)}</h1>
          <p>{intl.formatMessage(m.subtitle)}</p>
        </div>
        <FormGroup
          labelFor="register-input-name"
          label={intl.formatMessage(m.name)}
          error={touched.name ? errors.name : undefined}
          className="mb-4"
          length={values.name.length}
          maxLength={160}
        >
          <input
            name="name"
            type="text"
            className="input input--size-3"
            value={values.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup
          labelFor="register-input-email"
          label={intl.formatMessage(m.email)}
          error={touched.email ? errors.email : undefined}
          className="mb-4"
        >
          <input
            name="email"
            type="text"
            className="input input--size-3"
            placeholder={intl.formatMessage(m.emailPlaceholder)}
            value={values.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup
          labelFor="register-input-password"
          label={intl.formatMessage(m.password)}
          error={touched.password ? errors.password : undefined}
          className="mb-3"
        >
          <input
            name="password"
            type="password"
            className="input input--size-3"
            value={values.password}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup
          labelFor="register-input-password"
          label={intl.formatMessage(m.city)}
          error={touched.city ? errors.city : undefined}
          className="mb-3"
          hint={intl.formatMessage(m.addressHint)}
        >
          <InputAddress
            id="register-input-city"
            name="city"
            className="input input--size-3"
            placeholder={intl.formatMessage(m.city)}
            address={values.city}
            onChange={newAddressValue => setFieldValue('city', newAddressValue)}
            onBlur={() => setFieldTouched('city', true)}
            options={{
              types: ['(cities)'],
            }}
          />
        </FormGroup>
        <button
          type="submit"
          className="btn btn-primary btn--size-3 btn--block mb-3"
          disabled={isSubmitting}
        >
          {intl.formatMessage(m.submit)}
          <Icon name="arrow_forward" className="ml-2" />
          {isSubmitting && (
            <ActivityIndicator size={24} fill="#fff" className="ml-1" />
          )}
        </button>
        <hr className="my-2" />
        <a
          href={Page.Login}
          className="btn btn-text tw-normal btn--block btn--size-3 ta-left tc-gray-600"
          onClick={handleOptionsClick}
        >
          <Icon name="arrow_back" /> {intl.formatMessage(m.optionsLink)}
        </a>
      </div>
    </form>
  )
}

AuthenticationEmailNewAccount.displayName = 'AuthenticationEmailNewAccount'

export default withFormik<AuthenticationEmailNewAccountProps, Values>({
  displayName: 'AuthenticationEmailNewAccountFormik',
  mapPropsToValues: ({
    defaultValues = { name: '', email: '', password: '', city: null },
  }) => ({
    name: defaultValues.name,
    email: defaultValues.email,
    password: defaultValues.password,
    city: defaultValues.city,
  }),
  handleSubmit: async (
    values,
    { setFieldError, props: { onLogin }, setSubmitting, setStatus },
  ) => {
    try {
      const user = await createNewUser({
        name: values.name,
        email: values.email,
        password: values.password,
        city: values.city!.node.description,
        subscribeToNewsletter: true,
      })

      const sessionToken = await generateSessionTokenWithEmail(
        values.email,
        values.password,
      )
      user.token = sessionToken
      onLogin(user as User)
    } catch (error) {
      if (error.payload && error.payload.email) {
        setFieldError('email', 'Este email já está sendo utilizado')
      } else {
        setStatus({ error })
      }

      setSubmitting(false)
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(4)
      .max(160)
      .required(),
    password: Yup.string()
      .min(8)
      .max(100)
      .required(),
    email: Yup.string()
      .email()
      .required(),
    city: Yup.string()
      .nullable(true)
      .required(),
  }),
})(AuthenticationEmailNewAccount)
