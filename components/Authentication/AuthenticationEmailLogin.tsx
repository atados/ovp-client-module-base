import React, { Dispatch } from 'react'
import cx from 'classnames'
import { withFormik, FormikProps } from 'formik'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import {
  AuthenticationAction,
  AuthenticateBySessionTokenFn,
} from './Authentication'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import Link from 'next/link'
import { Page, Asset } from '~/common'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { generateSessionTokenWithEmail } from '~/redux/ducks/user'
import Status, { StatusLevel } from '../Status'

interface Values {
  email: string
  password: string
}

interface AuthenticationEmailLoginProps {
  readonly className?: string
  readonly defaultValues?: Values
  readonly dispatch: Dispatch<AuthenticationAction>
  readonly onLoginBySessionToken: AuthenticateBySessionTokenFn
}

const m = defineMessages({
  title: {
    id: 'authentication.email.title',
    defaultMessage: 'Entrar com email',
  },
  subtitle: {
    id: 'authentication.email.subtitle',
    defaultMessage:
      'Insira o endereço de email associado a sua conta de acesso.',
  },
  email: {
    id: 'input.label.email',
    defaultMessage: 'Email',
  },
  password: {
    id: 'input.label.password',
    defaultMessage: 'Senha',
  },
})

const AuthenticationEmailLogin: React.FC<AuthenticationEmailLoginProps &
  FormikProps<Values>> = ({
  className,
  values,
  touched,
  handleChange,
  handleSubmit,
  errors,
  isSubmitting,
  dispatch,
  status,
}) => {
  const intl = useIntl()
  const handleRegisterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    dispatch({
      type: 'SetPage',
      payload: 'new-account',
    })
  }
  const handleOptionsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    dispatch({
      type: 'SetPage',
      payload: 'options',
    })
  }

  return (
    <form className={cx('', className)} onSubmit={handleSubmit}>
      {status && status.error && (
        <>
          {status.error.payload &&
          status.error.payload.error === 'invalid_grant' ? (
            <div className="text-center mb-4 animate-slideInUp">
              <span className="bg-red-600 text-white px-3 py-2 rounded-full inline-block">
                <Icon name="error" className="mr-2" />
                Email ou senha invalidos
              </span>
            </div>
          ) : (
            <Status level={StatusLevel.Error} message={status.error.message} />
          )}
        </>
      )}
      <div className="max-w-sm mx-auto">
        <div className="text-center">
          {Asset.logoLight ? (
            <img
              src={Asset.logoLight}
              alt=""
              height="42"
              className="block mx-auto mb-3"
              style={{ maxWidth: '200px' }}
            />
          ) : (
            <div className="mb-4"></div>
          )}
          <h1 className="h2">{intl.formatMessage(m.title)}</h1>
          <p>{intl.formatMessage(m.subtitle)}</p>
        </div>
        <FormGroup
          labelFor="authentication-login-input-email"
          label={intl.formatMessage(m.email)}
          error={touched.email ? errors.email : undefined}
          className="mb-6"
        >
          <input
            name="email"
            type="text"
            className="input input--size-3"
            value={values.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup
          labelFor="authentication-login-input-password"
          label={intl.formatMessage(m.password)}
          error={touched.password ? errors.password : undefined}
        >
          <input
            name="password"
            type="password"
            className="input input--size-3"
            value={values.password}
            onChange={handleChange}
          />
        </FormGroup>
        <div className="text-right my-4">
          <Link href={Page.ForgotPassword}>
            <a>
              <FormattedMessage
                id="authenticationEmailLogin.forgotPassword"
                defaultMessage="Esqueceu sua senha?"
              />
            </a>
          </Link>
        </div>
        <button
          type="submit"
          className="btn text-white bg-primary-500 hover:bg-primary-600 btn--size-3 btn--block mb-4"
          disabled={isSubmitting}
        >
          <FormattedMessage
            id="authenticationEmailLogin.login"
            defaultMessage="Entrar"
          />
          {isSubmitting && (
            <ActivityIndicator size={24} fill="#fff" className="ml-1" />
          )}
        </button>
        <a
          href={Page.NewAccount}
          className="btn btn-text font-normal btn--block btn--size-3"
          onClick={handleRegisterClick}
        >
          <FormattedMessage
            id="authenticationEmailLogin.newAccount"
            defaultMessage="Ainda não possui uma conta?"
          />{' '}
          <span className="text-anchor">
            <FormattedMessage
              id="authenticationEmailLogin.signup"
              defaultMessage="Cadastrar-se"
            />
          </span>
        </a>
        <hr className="my-2" />
        <a
          href={Page.Login}
          className="btn btn-text font-normal btn--block btn--size-3 text-left text-gray-600"
          onClick={handleOptionsClick}
        >
          <Icon name="arrow_back" />{' '}
          <FormattedMessage
            id="authenticationEmailLogin.options"
            defaultMessage="Ver todas as opções de acesso"
          />
        </a>
      </div>
    </form>
  )
}

AuthenticationEmailLogin.displayName = 'AuthenticationEmailLogin'

export default withFormik<AuthenticationEmailLoginProps, Values>({
  displayName: 'AuthenticationEmailLoginFormik',
  mapPropsToValues: ({ defaultValues = { email: '', password: '' } }) => ({
    email: defaultValues.email,
    password: defaultValues.password,
  }),
  handleSubmit: async (
    values,
    { props: { onLoginBySessionToken }, setStatus, setSubmitting },
  ) => {
    setStatus(null)
    try {
      const sessionToken = await generateSessionTokenWithEmail(
        values.email,
        values.password,
      )
      onLoginBySessionToken(sessionToken, 'email')
    } catch (error) {
      setStatus({ error })
      setSubmitting(false)
    }
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .isValidChannelEmail()
      .required(),
    password: Yup.string().required(),
  }),
})(AuthenticationEmailLogin)
