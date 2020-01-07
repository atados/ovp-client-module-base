import { InjectedFormikProps, withFormik } from 'formik'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import FormGroup from '~/components/Form/FormGroup'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import Yup from '~/lib/form/yup'
import { throwActionError } from '~/lib/utils/redux'
import { recoverPassword } from '~/redux/ducks/recover-password'
import { Page } from '../common'
import { reportError } from '../lib/utils/error'
import { FormattedMessage } from 'react-intl'

enum Status {
  EqualsEmail,
  PasswordTooSimilar,
  Success,
  Error,
}

const Container = styled.div`
  border-radius: 3px;
`

interface Values {
  password: string
  confirmPassword: string
}

interface AuthenticationRecoverProps {
  readonly onSubmit: (payload: { token: string; password: string }) => any
  readonly token: string
  readonly successRedirect?: string
  readonly className?: string
  readonly defaultValue?: Values
}

interface AuthenticationRecoverState {
  readonly sent: boolean
}

class AuthenticationRecover extends React.Component<
  InjectedFormikProps<AuthenticationRecoverProps, Values>,
  AuthenticationRecoverState
> {
  public static getInitialProps = ({ query: { token } }) => ({
    token: String(token),
  })

  public render() {
    const {
      successRedirect,
      className,
      handleSubmit,
      isValid,
      handleChange,
      handleBlur,
      values,
      errors,
      touched,
      isSubmitting,
      status,
    } = this.props

    let children: React.ReactNode | undefined

    if (status === Status.Success) {
      children = (
        <Container className={className}>
          <div className="text-center">
            <h2 className="font-medium mb-1">Senha recuperada</h2>
            <Link href={Page.Login}>
              <a className="btn btn-primary font-normal btn--block btn--size-4">
                Ir para o login
              </a>
            </Link>
          </div>
        </Container>
      )
    } else {
      children = (
        <Container className={className}>
          <form
            action={`/auth/email/?next=${successRedirect}`}
            method="POST"
            onSubmit={handleSubmit}
          >
            <h2 className="font-medium mb-4 text-center">Recuperar senha</h2>
            <FormGroup
              label="Nova senha"
              labelFor="recover-input-password"
              error={touched.password ? errors.password : undefined}
              className="mb-6"
            >
              <input
                id="recover-input-password"
                name="password"
                type="password"
                className="input input--size-4"
                placeholder="Senha"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <FormGroup
              label="Confirmar senha"
              labelFor="recover-input-confirm-password"
              error={
                touched.confirmPassword ? errors.confirmPassword : undefined
              }
              className="mb-6"
            >
              <input
                id="recover-input-confirm-password"
                name="confirmPassword"
                type="password"
                className="input input--size-4"
                placeholder="Confirmar senha"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn--block btn--size-4 mb-2 ${
                !isValid ? 'btn-disabled' : 'btn-primary'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
            {status === Status.EqualsEmail && (
              <span className="d-Block text-center text-red-600 mt-4">
                <FormattedMessage
                  id="page.recoverPassword.error.equalEmail"
                  defaultMessage="A senha é muito parecida com o email"
                />
              </span>
            )}
            {status === Status.PasswordTooSimilar && (
              <span className="d-Block text-center text-red-600 mt-4">
                <FormattedMessage
                  id="page.recoverPassword.error.tooSimiliar"
                  defaultMessage="A senha é muito parecida com o email o a senha antiga"
                />
              </span>
            )}
            {status === Status.Error && (
              <span className="d-Block text-center text-red-600 mt-4">
                <FormattedMessage
                  id="page.recoverPassword.error.internal"
                  defaultMessage="Falha ao conectar com o servidor"
                />
              </span>
            )}
          </form>
        </Container>
      )
    }

    return (
      <Layout>
        <Meta title="Recuperar senha" />
        <div className="py-8 bg-muted">
          <div className="container container--sm">
            <div className="card p-5">{children}</div>
          </div>
        </div>
      </Layout>
    )
  }
}

const AuthenticationRecoverSchema = Yup.object().shape({
  password: Yup.string()
    .min(6)
    .max(200)
    .required(),
  confirmPassword: Yup.string()
    .equals('password')
    .min(6)
    .max(200)
    .required(),
})
const mapDispatchToProps = dispatch => ({
  onSubmit: (payload: { token: string; password: string }) =>
    dispatch(recoverPassword(payload)),
})

export default connect(
  undefined,
  mapDispatchToProps,
)(
  withFormik<AuthenticationRecoverProps, Values>({
    displayName: 'RecoverForm',
    validationSchema: AuthenticationRecoverSchema,
    handleSubmit: async (
      values,
      { setStatus, setSubmitting, props: { onSubmit, token } },
    ) => {
      try {
        await onSubmit({ token, password: values.password }).then(
          throwActionError,
        )
        setStatus(Status.Success)
      } catch (error) {
        if (
          error &&
          error.payload &&
          error.payload.errors &&
          error.payload.errors.length
        ) {
          if (/email/.test(error.payload.errors)) {
            setStatus(Status.EqualsEmail)
          } else if (
            error.payload.errors[0] &&
            error.payload.errors[0][0] === 'password_too_similar'
          ) {
            setStatus(Status.PasswordTooSimilar)
          }
        } else {
          reportError(error)
          setStatus(Status.Error)
        }
      }
      setSubmitting(false)
    },
    mapPropsToValues: () => ({
      password: '',
      confirmPassword: '',
    }),
  })(AuthenticationRecover),
)
