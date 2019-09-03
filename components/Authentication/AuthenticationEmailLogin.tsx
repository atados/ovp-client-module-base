import React, { Dispatch } from 'react'
import cx from 'classnames'
import { withFormik, FormikProps } from 'formik'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { AuthenticationAction } from './Authentication'

interface Values {
  email: string
  password: string
}

interface AuthenticationEmailLoginProps {
  readonly className?: string
  readonly defaultValues?: Values
  readonly dispatch: Dispatch<AuthenticationAction>
}

const AuthenticationEmailLogin: React.FC<
  AuthenticationEmailLoginProps & FormikProps<Values>
> = ({ className, values, touched, errors }) => {
  return (
    <div className={cx('', className)}>
      <div className="max-w-sm mx-auto">
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
          />
        </FormGroup>
        <FormGroup
          labelFor="authentication-login-input-password"
          label="Senha"
          error={touched.password ? errors.password : undefined}
          className="mb-4"
        >
          <input
            name="password"
            type="password"
            className="input input--size-3"
            value={values.password}
          />
        </FormGroup>
        <button
          type="submit"
          className="btn btn-primary btn--size-3 btn--block"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

AuthenticationEmailLogin.displayName = 'AuthenticationEmailLogin'

export default withFormik<AuthenticationEmailLoginProps, Values>({
  displayName: 'AuthenticationEmailLoginFormik',
  mapPropsToValues: ({ defaultValues = { email: '', password: '' } }) => ({
    email: defaultValues.email,
    password: defaultValues.password,
  }),
  handleSubmit: values => {
    console.info(values)
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string().required(),
  }),
})(AuthenticationEmailLogin)
