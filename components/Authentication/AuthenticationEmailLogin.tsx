import React, { Dispatch } from 'react'
import cx from 'classnames'
import { withFormik, FormikProps } from 'formik'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { AuthenticationAction } from './Authentication'
import { useIntl, defineMessages } from 'react-intl'
import Link from 'next/link'
import { Page, Asset } from '~/base/common'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { generateSessionTokenWithEmail } from '~/base/redux/ducks/user'
import Status, { StatusLevel } from '../Status'

interface Values {
  email: string
  password: string
}

interface AuthenticationEmailLoginProps {
  readonly className?: string
  readonly defaultValues?: Values
  readonly dispatch: Dispatch<AuthenticationAction>
  readonly onLoginBySessionToken: (sessionToken: string) => any
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
})

const AuthenticationEmailLogin: React.FC<
  AuthenticationEmailLoginProps & FormikProps<Values>
> = ({
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
          labelFor="authentication-login-input-email"
          label="Email"
          error={touched.email ? errors.email : undefined}
          className="mb-4"
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
          label="Senha"
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
        <div className="ta-right my-3">
          <Link href={Page.ForgotPassword}>
            <a>Esqueceu sua senha?</a>
          </Link>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn--size-3 btn--block mb-3"
          disabled={isSubmitting}
        >
          Entrar
          {isSubmitting && (
            <ActivityIndicator size={24} fill="#fff" className="ml-1" />
          )}
        </button>
        <a
          href="/entrar/cadastro?next=/"
          className="btn btn-text tw-normal btn--block btn--size-3"
          onClick={handleRegisterClick}
        >
          Ainda não possui uma conta?{' '}
          <span className="tc-link">Cadastre-se</span>
        </a>
        <hr className="my-2" />
        <a
          href="/entrar/cadastro?next=/"
          className="btn btn-text tw-normal btn--block btn--size-3 ta-left tc-gray-600"
          onClick={handleOptionsClick}
        >
          <Icon name="arrow_back" /> Ver todas opções de acesso
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
    try {
      const sessionToken = await generateSessionTokenWithEmail(
        values.email,
        values.password,
      )
      onLoginBySessionToken(sessionToken)
    } catch (error) {
      setStatus({ error })
      setSubmitting(false)
    }
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string().required(),
  }),
})(AuthenticationEmailLogin)