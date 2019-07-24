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

enum Status {
  EqualsEmail,
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
          <div className="ta-center">
            <h2 className="tw-medium mb-1">Senha recuperada</h2>
            <p className="mb-4 text-muted">
              Verifique no seu email um link para redefinir sua senha. Se não
              aparecer dentro de alguns minutos, verifique sua pasta de spam.
            </p>

            <Link href="/enter" as="/entrar">
              <a className="btn btn-primary tw-normal btn--block btn--size-4">
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
            <h2 className="tw-medium mb-3 ta-center">Recuperar senha</h2>
            <FormGroup
              label="Nova senha"
              labelFor="recover-input-password"
              error={touched.password ? errors.password : undefined}
              className="mb-4"
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
              className="mb-4"
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
              <span className="d-Block ta-center tc-error mt-3">
                A senha é muito parecida com o email
              </span>
            )}
            {status === Status.Error && (
              <span className="d-Block ta-center tc-error mt-3">
                Falha ao conectar com o servidor
              </span>
            )}
          </form>
        </Container>
      )
    }

    return (
      <Layout>
        <Meta title="Recuperar senha" />
        <div className="py-5 bg-muted">
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
    .min(8)
    .max(100)
    .required(),
  confirmPassword: Yup.string()
    .equals('password', 'A senhas não são iguais')
    .min(8)
    .max(100)
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
          error.payload.errors.length &&
          /email/.test(error.payload.errors)
        ) {
          setStatus(Status.EqualsEmail)
        } else {
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
