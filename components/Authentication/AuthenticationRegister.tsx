import { FormikState, InjectedFormikProps, withFormik } from 'formik'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import FormGroup from '~/components/Form/FormGroup'
import InputAddress, {
  InputAddressValueType,
} from '~/components/InputAddress/InputAddress'
import { Link as RouterSwitchLink } from '~/components/RouterSwitch'
import Yup from '~/lib/form/yup'
import {
  AUTH_ERROR_EMAIL_CODE,
  AUTH_ERROR_INTERNAL_CODE,
  AUTH_REGISTER_LOCAL_STORAGE_KEY,
} from './constants'

const Form = styled.form`
  border-radius: 3px;
`

const FacebookButton = styled.a`
  background: #3b5998;
  color: #fff !important;
  padding: 14px 20px 14px 40px;
`

const GoogleButton = styled.a`
  padding: 14px 20px 14px 40px;
  background: #4285f4;
  color: #fff !important;
`

const Icon = styled.div`
  float: left;
  margin: -4px 24px 0 -24px;
  margin-right: 12px;

  &.icon--google {
    margin-top: -5px;
    margin-left: -26px;
    width: 30px;
    height: 30px;
    background: #fff;
    padding: 5px;
    background: #fff;
    border-radius: 3px;
  }
`

const HrText = styled.div`
  position: relative;
  padding: 20px 0;
  text-align: center;

  > span {
    position: relative;
    z-index: 10;
    background: #fff;
    padding: 0 10px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    height: 1px;
    background: #ccc;
    bottom: 0;
    left: 0;
    text-align: center;
    right: 0;
    margin: auto;
  }
`

interface Values {
  email: string
  name: string
  password: string
  city: InputAddressValueType
}

interface AuthenticationRegisterProps {
  readonly successRedirect?: string
  readonly className?: string
  readonly errorCode?: string
  readonly defaultValue?: Values
  readonly headerDisabled?: boolean
}

class AuthenticationRegister extends React.Component<
  InjectedFormikProps<AuthenticationRegisterProps, Values>
> {
  public static defaultProps = {
    successRedirect: '/',
    className: undefined,
  }

  public componentDidMount() {
    const draftJSON = localStorage.getItem(AUTH_REGISTER_LOCAL_STORAGE_KEY)
    const hasEmailError = this.props.errorCode === AUTH_ERROR_EMAIL_CODE

    if (draftJSON) {
      const newFormikState: FormikState<Values> = {
        values: this.props.values,
        touched: this.props.touched,
        errors: this.props.errors,
        isValidating: this.props.isValidating,
        isSubmitting: this.props.isSubmitting,
        submitCount: this.props.submitCount,
      }

      if (hasEmailError) {
        newFormikState.errors.email = 'Esse email já sendo usado.'
        newFormikState.touched.email = true
      }

      if (draftJSON) {
        try {
          const draft = JSON.parse(draftJSON)
          Object.assign(newFormikState.values, draft)
        } catch (error) {
          // ...
        }
      }

      this.props.setFormikState(newFormikState)
    }
  }

  public componentWillReceiveProps({ isValid, values }) {
    if (isValid) {
      localStorage.setItem(
        AUTH_REGISTER_LOCAL_STORAGE_KEY,
        JSON.stringify({ email: values.email, name: values.name }),
      )
    }
  }

  public render() {
    const {
      successRedirect,
      className,
      values,
      errors,
      touched,
      handleSubmit,
      handleBlur,
      handleChange,
      setFieldValue,
      setFieldTouched,
      isValid,
      errorCode,
      headerDisabled,
    } = this.props

    return (
      <Form
        onSubmit={isValid ? undefined : handleSubmit}
        action={`/auth/email/register/?next=${successRedirect}`}
        className={className ? ` ${className}` : ''}
        method="post"
      >
        {!headerDisabled && (
          <>
            <h1 className="tw-medium mb-0">Nova conta</h1>
            <h4 className="tw-normal tc-muted ts-medium mb-4">
              ou{' '}
              <RouterSwitchLink href="/login">
                <a
                  href={`/entrar?next=${successRedirect}`}
                  className="td-underline"
                >
                  entre na sua conta
                </a>
              </RouterSwitchLink>
            </h4>
          </>
        )}

        <FacebookButton
          href={`/auth/facebook/?next=${successRedirect}`}
          className="btn tw-normal btn--size-3 btn--block ta-left mb-2"
        >
          {
            // @ts-ignore
            <Icon
              as="svg"
              // @ts-ignore
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 216 216"
              color="#FFFFFF"
              width="28"
              height="28"
            >
              <path
                fill="#FFFFFF"
                d="
        M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
        11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
        11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
        15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
        11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
              />
            </Icon>
          }
          Continuar com Facebook
        </FacebookButton>
        <GoogleButton
          href={`/auth/google/?next=${successRedirect}`}
          className="btn tw-normal btn--size-3 btn--block ta-left mb-2"
        >
          <Icon className="icon--google">
            <svg
              viewBox="0 0 512 512"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <path
                  d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z"
                  fill="#4285f4"
                />
                <path
                  d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z"
                  fill="#34a853"
                />
                <path
                  d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z"
                  fill="#fbbc05"
                />
                <path
                  d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z"
                  fill="#ea4335"
                />
                <path d="M20 20h472v472H20V20z" />
              </g>
            </svg>
          </Icon>
          Continuar com Google
        </GoogleButton>

        <HrText>
          <span>ou cadastre-se com seu email</span>
        </HrText>
        <FormGroup
          error={touched.name ? errors.name : undefined}
          className="mb-2"
        >
          <input
            id="register-input-name"
            name="name"
            type="text"
            className="input input--size-4"
            placeholder="Seu nome"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
        <FormGroup
          error={touched.email ? errors.email : undefined}
          className="mb-2"
        >
          <input
            id="register-input-email"
            name="email"
            type="text"
            className="input input--size-4"
            placeholder="Endereço de email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
        <FormGroup
          error={touched.password ? errors.password : undefined}
          className="mb-2"
        >
          <input
            id="register-input-password"
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
          error={touched.city ? errors.city : undefined}
          className="mb-4"
          hint="Comece a escrever e selecione uma opção"
        >
          <InputAddress
            id="register-input-city"
            name="input-address"
            className="input input--size-4"
            placeholder="Cidade"
            address={values.city}
            onChange={newAddressValue => setFieldValue('city', newAddressValue)}
            onBlur={() => setFieldTouched('city', true)}
            options={{
              types: ['(cities)'],
            }}
          />
          <input
            type="hidden"
            name="city"
            value={values.city ? values.city.node.description : ''}
          />
        </FormGroup>
        <label htmlFor="input-register-newsletter-check" className="media mb-3">
          <div>
            <input
              id="input-register-newsletter-check"
              name="is_subscribed_to_newsletter"
              type="checkbox"
              className="mr-2"
              defaultChecked
            />
          </div>
          <div className="media-body ">
            Eu gostaria de receber emails sobre as vagas mais adequadas a mim
            periodicamente.
          </div>
        </label>
        <button
          type="submit"
          className="btn btn-primary btn--block btn--size-4 mb-3"
        >
          Cadastre-se
        </button>
        {errorCode === AUTH_ERROR_INTERNAL_CODE && (
          <span className="tc-error ts-large block mb-4 mt-4 ta-center">
            Erro ao tentar se conectar com o servidor
          </span>
        )}
        <p className="tc-muted-dark ta-center">
          Ao cadastrar-se você assume que leu e que concorda com nossos{' '}
          <Link href="/channel/terms-privacy" as="/sobre/privacidade">
            <a>Termos de privacidade</a>
          </Link>
          .
        </p>
        <hr />
        <RouterSwitchLink href="/login">
          <a
            href={`/entrar?successRedirect=${successRedirect}`}
            className="btn btn-text tw-normal btn--block btn--size-4"
          >
            Já possui uma conta? <span className="tc-link">Entrar</span>
          </a>
        </RouterSwitchLink>
      </Form>
    )
  }
}

const AuthenticationRegisterSchema = Yup.object().shape({
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
})

const defaultValue = {
  name: '',
  password: '',
  email: '',
  city: null,
}

export default withFormik<AuthenticationRegisterProps, Values>({
  displayName: 'RegisterForm',
  validationSchema: AuthenticationRegisterSchema,
  handleSubmit: () => {
    // Disabled submit preventing when values are valid
  },
  mapPropsToValues: ({ defaultValue: value = defaultValue }) => ({
    name: value.name,
    password: value.password,
    email: value.email,
    city: value.city,
  }),
})(AuthenticationRegister)
