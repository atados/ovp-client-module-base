import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { requestPasswordRecovery } from '~/redux/ducks/recover-password-request'
import { Page } from '~/common'

const Container = styled.div`
  border-radius: 3px;
`

interface Values {
  email: string
}

interface AuthenticationRecoverProps {
  readonly onSubmit: (email: string) => any
  readonly successRedirect?: string
  readonly className?: string
  readonly defaultValue?: Values
}

enum AuthenticationRecoverStatus {
  Sent,
  Failed,
}

const AuthenticationRecover: React.FC<InjectedFormikProps<
  AuthenticationRecoverProps,
  Values
>> = ({
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
}) => {
  if (status === AuthenticationRecoverStatus.Sent) {
    return (
      <Container className={className}>
        <div className="text-center">
          <h2 className="font-medium mb-1">Recupere sua senha</h2>
          <p className="mb-6 text-gray-600">
            Verifique no seu email um link para redefinir sua senha. Se não
            aparecer dentro de alguns minutos, verifique sua pasta de spam.
          </p>
        </div>
        <hr />
        <a
          href={Page.Login}
          className="btn btn-text font-normal btn--block btn--size-4"
        >
          Voltar para o login
        </a>
      </Container>
    )
  }

  return (
    <Container className={className}>
      <form
        action={`/auth/email/?next=${successRedirect}`}
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h2 className="font-medium mb-1">Recupere sua senha</h2>
          <p className="mb-6 text-gray-600">
            Enviaremos um email a você instruindo como prosseguir
          </p>
        </div>
        <FormGroup
          label="Endereço de email"
          labelFor="recover-input-email"
          error={touched.email ? errors.email : undefined}
          className="mb-2"
        >
          <input
            id="recover-input-email"
            name="email"
            type="text"
            className="input input--size-4"
            placeholder="Endereço de email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`btn btn--block btn--size-4 mb-2 ${
            !isValid ? 'btn-disabled' : 'btn-primary'
          }`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
        <hr />
        <a
          href={Page.Login}
          className="btn btn-text font-normal btn--block btn--size-4"
        >
          Lembrou sua senha? <span className="text-anchor">Entrar</span>
        </a>
      </form>
    </Container>
  )
}

const AuthenticationRecoverSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
})

const defaultValue = { email: '' }

const mapDispatchToProps = dispatch => ({
  onSubmit: (email: string) => dispatch(requestPasswordRecovery(email)),
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
      { setSubmitting, setStatus, props: { onSubmit } },
    ) => {
      try {
        await onSubmit(values.email)
        setStatus(AuthenticationRecoverStatus.Sent)
        setSubmitting(false)
      } catch (error) {
        // Error is already reported on ducks
        setStatus(AuthenticationRecoverStatus.Failed)
      }
    },
    mapPropsToValues: ({ defaultValue: value = defaultValue }) => ({
      email: value.email,
    }),
  })(AuthenticationRecover),
)
