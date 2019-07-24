import { InjectedFormikProps, withFormik } from 'formik'
import { NextContext, NextStatelessComponent } from 'next'
import * as React from 'react'
import { connect } from 'react-redux'
import ActivityIndicator from '~/components/ActivityIndicator'
import ErrorMessage from '~/components/Form/ErrorMessage'
import FormGroup from '~/components/Form/FormGroup'
import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import Meta from '~/components/Meta'
import PublicUserLayout from '~/components/PublicUserLayout'
import { getPublicUserLayoutInitialProps } from '~/components/PublicUserLayout/PublicUserLayout'
import UserSettingsNav from '~/components/UserSettings/UserSettingsNav'
import Yup from '~/lib/form/yup'
import { NotFoundPageError } from '~/lib/next/errors'
import { User } from '~/redux/ducks/user'
import {
  PasswordUpdatePayload,
  updatePassword,
} from '~/redux/ducks/user-update'
import { RootState } from '~/redux/root-reducer'

interface SettingsPasswordProps {
  readonly currentUser?: User
  readonly onSubmit: (values: PasswordUpdatePayload) => any
  readonly causesSelectItems: InputSelectItem[]
  readonly skillsSelectItems: InputSelectItem[]
}

interface Values {
  readonly currentPassword: string
  readonly newPassword: string
  readonly confirmNewPassword: string
}

const SettingsPassword: NextStatelessComponent<
  InjectedFormikProps<SettingsPasswordProps, Values>,
  {}
> = ({
  currentUser,
  touched,
  handleChange,
  handleBlur,
  errors,
  values,
  isSubmitting,
  handleSubmit,
  status,
}) => {
  if (!currentUser) {
    return <PublicUserLayout />
  }

  return (
    <PublicUserLayout sidebar={<UserSettingsNav />}>
      <Meta title={currentUser.name} />
      <form method="POST" action="/settings/profile" onSubmit={handleSubmit}>
        <h4 className="tw-normal">Alterar senha</h4>
        <hr />
        <div className="row">
          <div className="col-lg-7">
            <FormGroup
              labelFor="profile-input-current-password"
              label="Senha atual"
              error={
                touched.currentPassword ? errors.currentPassword : undefined
              }
              length={values.currentPassword.length}
              className="mb-4"
            >
              <input
                id="profile-input-current-password"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                className="input input--size-3"
              />
            </FormGroup>
            <FormGroup
              labelFor="profile-input-new-password"
              label="Nova senha"
              error={touched.newPassword ? errors.newPassword : undefined}
              length={values.newPassword.length}
              className="mb-4"
            >
              <input
                id="profile-input-new-password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                className="input input--size-3"
              />
            </FormGroup>
            <FormGroup
              labelFor="profile-input-confirm-new-password"
              label="Confirmar nova senha"
              error={
                touched.confirmNewPassword
                  ? errors.confirmNewPassword
                  : undefined
              }
              length={values.confirmNewPassword.length}
              className="mb-4"
            >
              <input
                id="profile-input-confirm-new-password"
                name="confirmNewPassword"
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                className="input input--size-3"
              />
            </FormGroup>
            <button
              type="submit"
              className="btn btn--size-3 btn-primary"
              disabled={isSubmitting}
            >
              Salvar alterações
              {isSubmitting && (
                <ActivityIndicator size={36} fill="white" className="ml-1" />
              )}
            </button>
            {status && (
              <ErrorMessage className="mt-2">
                {status.payload && status.payload.current_password
                  ? 'Senha atual inválida'
                  : 'Falha ao conectar-se com o servidor'}
              </ErrorMessage>
            )}
          </div>
        </div>
      </form>
    </PublicUserLayout>
  )
}

SettingsPassword.displayName = 'SettingsPassword'
SettingsPassword.getInitialProps = async (context: NextContext) => {
  await getPublicUserLayoutInitialProps(context)
  const {
    user: authenticatedUser,
    publicUser: { node: user },
  } = context.store.getState()

  if (!user || !authenticatedUser || user.slug !== user.slug) {
    throw new NotFoundPageError()
  }

  return {}
}

const mapStateToProps = ({ user }: RootState) => ({
  currentUser: user,
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (values: PasswordUpdatePayload) => dispatch(updatePassword(values)),
})

const PublicUserEditSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8)
    .max(100)
    .required(),
  newPassword: Yup.string()
    .min(8)
    .max(100)
    .required(),
  confirmNewPassword: Yup.string()
    .equals('newPassword', 'A senhas não são iguais')
    .min(8)
    .max(100)
    .required(),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik<SettingsPasswordProps, Values>({
    displayName: 'SettingsPasswordEdit',
    mapPropsToValues: () => ({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }),
    validationSchema: PublicUserEditSchema,
    handleSubmit: async (
      values,
      { setSubmitting, setStatus, props: { onSubmit } },
    ) => {
      try {
        const action = await onSubmit({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })

        if (action.error) {
          setStatus(action.payload)
        }

        setSubmitting(false)
      } catch (error) {
        setStatus(error)
      }
    },
  })(SettingsPassword),
)
