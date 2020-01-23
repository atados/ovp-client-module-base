import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import Yup from '~/lib/form/yup'
import { throwActionError } from '~/lib/utils/redux'
import { inviteMember } from '~/redux/ducks/organization-members'
import ActivityIndicator from '../ActivityIndicator'
import FormGroup from '../Form/FormGroup'

const InviteMemberSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
})

interface InviteMemberProps {
  readonly organizationSlug: string
  readonly onSubmit?: (email: string) => any
}

interface Values {
  email: string
}

const InviteMember: React.FC<InjectedFormikProps<
  InviteMemberProps,
  Values
>> = ({
  values,
  touched,
  errors,
  handleSubmit,
  handleBlur,
  handleChange,
  isSubmitting,
  isValid,
  status,
}) => (
  <form method="post" onSubmit={handleSubmit}>
    <h4 className="font-normal">Adicionar membro à ONG</h4>
    <hr />
    {status && status.success ? (
      <p>
        Um email foi enviado para{' '}
        <span className="font-medium">{values.email}</span> com um link do
        convite para participar dessa ONG.
      </p>
    ) : (
      <>
        <FormGroup
          label="Email"
          labelFor="invite-email-input"
          error={touched.email ? errors.email : undefined}
        >
          <input
            id="invite-email-input"
            name="email"
            type="text"
            className="input input--size-3"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            placeholder="Insira o email do novo membro"
            disabled={isSubmitting}
          />
        </FormGroup>
        <button
          type="submit"
          className={`btn btn--size-3 btn--block mt-4 ${
            isValid ? 'text-white bg-primary-500 hover:bg-primary-600' : 'btn-disabled '
          }`}
          disabled={!isValid || isSubmitting}
        >
          Enviar convite
          {isSubmitting && (
            <ActivityIndicator size={36} fill="white" className="ml-1" />
          )}
        </button>
        <span className="text-gray-600 block text-center text-sm mt-4">
          Essa pessoa receberá total acesso ao perfil da ONG podendo cadastrar
          vagas e editar informações importantes.
        </span>
      </>
    )}
  </form>
)

InviteMember.displayName = 'InviteMember'

const mapDispatchToProps = (
  dispatch,
  { organizationSlug }: InviteMemberProps,
) => ({
  onSubmit: (email: string) =>
    dispatch(inviteMember({ email, organizationSlug })),
})

export default React.memo(
  connect(
    undefined,
    mapDispatchToProps,
  )(
    withFormik<InviteMemberProps, Values>({
      mapPropsToValues: () => ({ email: '' }),
      handleSubmit: async (
        values,
        { props, setStatus, setFieldError, setSubmitting },
      ) => {
        try {
          await props.onSubmit!(values.email).then(throwActionError)
          setStatus({ success: true })
        } catch (error) {
          if (error.payload && error.payload.email) {
            if (error.payload.email[0].includes('part of this organization')) {
              setFieldError('email', 'Esse usuário já faz parte da ONG')
            } else if (error.payload.email[0].includes('is not valid')) {
              setFieldError(
                'email',
                'Esse email não está registrado na plataforma.',
              )
            }
          }
        }
        setSubmitting(false)
      },
      validationSchema: InviteMemberSchema,
    })(InviteMember),
  ),
)
