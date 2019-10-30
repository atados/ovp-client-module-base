import { InjectedFormikProps, withFormik } from 'formik'
import { NextPage } from 'next'
import React from 'react'
import { connect } from 'react-redux'
import ActivityIndicator from '~/components/ActivityIndicator'
import ErrorMessage from '~/components/Form/ErrorMessage'
import FormGroup from '~/components/Form/FormGroup'
import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import Meta from '~/components/Meta'
import PublicUserLayout from '~/components/PublicUserLayout'
import Yup from '~/lib/form/yup'
import { User } from '~/redux/ducks/user'
import {
  PasswordUpdatePayload,
  updatePassword,
} from '~/redux/ducks/user-update'
import { RootState } from '~/redux/root-reducer'
import {
  ViewerSettingsLayout,
  getViewerSettingsInitialProps,
} from '../components/ViewerSettings'
import Icon from '../components/Icon'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'

const m = defineMessages({
  title: {
    id: 'pages.settingsPassword.title',
    defaultMessage: 'Alterar senha',
  },
  'Senha atual': {
    id: 'settingsPassword.password',
    defaultMessage: 'Senha atual',
  },
  'Nova senha': {
    id: 'settingsPassword.prevPassword',
    defaultMessage: 'Nova senha',
  },
  'Confirmar nova senha': {
    id: 'settingsPassword.confirmPassword',
    defaultMessage: 'Confirmar nova senha',
  },
})

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

const SettingsPassword: NextPage<
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
  const intl = useIntl()

  if (!currentUser) {
    return <PublicUserLayout />
  }

  return (
    <ViewerSettingsLayout>
      <Meta title={intl.formatMessage(m.title)} />
      <div className="bg-white rounded-lg shadow">
        <div className="py-3 px-3">
          <h4 className="tw-normal mb-0 text-xl leading-loose">
            <Icon
              name="lock"
              className="bg-gray-200 rounded-full w-10 h-10 ta-center mr-3"
            />
            {intl.formatMessage(m.title)}
          </h4>
        </div>
        <form
          method="POST"
          action="/settings/profile"
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-5"
        >
          <FormGroup
            labelFor="profile-input-current-password"
            label={intl.formatMessage(m['Senha atual'])}
            error={touched.currentPassword ? errors.currentPassword : undefined}
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
            label={intl.formatMessage(m['Nova senha'])}
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
            label={intl.formatMessage(m['Confirmar nova senha'])}
            error={
              touched.confirmNewPassword ? errors.confirmNewPassword : undefined
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
            className="btn btn--size-3 btn-primary w-full block"
            disabled={isSubmitting}
          >
            <FormattedMessage
              id="settingsPassword.submit"
              defaultMessage="Salvar alterações"
            />
            {isSubmitting && (
              <ActivityIndicator size={36} fill="white" className="ml-1" />
            )}
          </button>
          {status && (
            <ErrorMessage className="mt-2">
              {status.payload && status.payload.current_password ? (
                <FormattedMessage
                  id="settingsPassword.invalidPassword"
                  defaultMessage="Senha atual inválida"
                />
              ) : (
                <FormattedMessage
                  id="settingsPassword.error"
                  defaultMessage="Falha ao conectar-se com o servidor"
                />
              )}
            </ErrorMessage>
          )}
        </form>
      </div>
    </ViewerSettingsLayout>
  )
}

SettingsPassword.displayName = 'SettingsPassword'
SettingsPassword.getInitialProps = getViewerSettingsInitialProps

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
    .equals('newPassword')
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
