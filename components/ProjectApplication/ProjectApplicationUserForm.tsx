import { InjectedFormikProps, withFormik } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import MaskedTextInput from 'react-text-mask'
import ActivityIndicator from '~/components/ActivityIndicator'
import FormGroup from '~/components/Form/FormGroup'
import Icon from '~/components/Icon'
import InputAddress from '~/components/InputAddress'
import {
  AddressKind,
  InputAddressValueType,
} from '~/components/InputAddress/InputAddress'
import * as masks from '~/lib/form/masks'
import { RE_DATE, RE_PHONE } from '~/lib/form/regex'
import Yup from '~/lib/form/yup'
import { formatToBRDate, formatToUSDate } from '~/lib/utils/string'
import { PublicUser } from '~/redux/ducks/public-user'
import { User } from '~/redux/ducks/user'
import { updateUser, UserOverrides } from '~/redux/ducks/user-update'
import { RootState } from '~/redux/root-reducer'

interface ProjectApplicationUserFormProps {
  readonly currentUser?: User
  readonly className?: string
  readonly currentPublicUser: PublicUser
  readonly onSubmit: (values: UserOverrides) => any
  readonly onFinish: () => any
}

interface Values {
  readonly phone: string
  readonly birthday_date: string
  readonly city: InputAddressValueType
  readonly gender: string
}

const ProjectApplicationUserFormProps: React.SFC<
  InjectedFormikProps<ProjectApplicationUserFormProps, Values>
> = ({
  className,
  handleSubmit,
  touched,
  handleChange,
  handleBlur,
  errors,
  values,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={`${className || ''} card no-border radius-10 shadow-xl p-5`}
    >
      <h4 className="tw-normal">Preencha seu perfil</h4>
      <hr />

      <FormGroup
        labelFor="profile-input-phone"
        label="Telefone"
        error={touched.phone ? errors.phone : undefined}
        length={values.phone.length}
        className="mb-4"
        hint="Essa informação é obrigatória para se inscrever numa ação"
      >
        <MaskedTextInput
          id="profile-input-cnpj"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input--size-3"
          mask={masks.phone}
          placeholder="(__) ____-____"
          guide={false}
        />
      </FormGroup>

      <FormGroup
        labelFor="profile-input-birthday_date"
        label="Data de nascimento"
        error={touched.birthday_date ? errors.birthday_date : undefined}
        length={values.birthday_date.length}
        className="mb-4"
        hint="Essa informação é obrigatória para se inscrever numa ação"
      >
        <MaskedTextInput
          id="profile-input-birthday_date"
          name="birthday_date"
          value={values.birthday_date}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input--size-3"
          mask={masks.date}
          placeholder="__/__/____"
          guide={false}
        />
      </FormGroup>

      <FormGroup
        labelFor="profile-input-city"
        label="Cidade"
        error={touched.city ? errors.city : undefined}
        className="mb-4"
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

      <FormGroup
        labelFor="profile-input-gender"
        label="Gênero"
        error={touched.gender ? errors.gender : undefined}
        length={values.gender.length}
        className="mb-4"
        required={false}
      >
        <select
          id="profile-input-gender"
          name="gender"
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input--size-3"
        >
          <option value="unspecified">Não especificado</option>
          <option value="male">Homem</option>
          <option value="female">Mulher</option>
        </select>
      </FormGroup>

      <p className="tc-muted ts-small">
        Você pode editar a qualquer momento essas informações nas Configurações.
      </p>

      <div className="ta-right">
        <button
          type="submit"
          className="btn btn--size-3 btn-primary"
          disabled={isSubmitting}
        >
          Continuar para a inscrição
          <Icon name="arrow_forward" className="ml-2" />
          {isSubmitting && (
            <ActivityIndicator size={36} fill="white" className="ml-1" />
          )}
        </button>
      </div>
    </form>
  )
}

ProjectApplicationUserFormProps.displayName = 'ProjectApplicationUserFormProps'

const mapStateToProps = ({
  user: currentUser,
  currentUserProfile,
}: RootState) => ({
  currentUser,
  currentPublicUser: currentUserProfile.node,
})

const ProjectApplicationUserFormSchema = Yup.object().shape({
  city: Yup.object()
    .nullable(true)
    .required(),
  phone: Yup.string()
    .matches(RE_PHONE, 'Esse número de telefone não é válido')
    .required(),
  birthday_date: Yup.string()
    .matches(RE_DATE, 'Essa data não é valida')
    .required(),
})

export default connect(
  mapStateToProps,
  { onSubmit: updateUser },
)(
  withFormik<ProjectApplicationUserFormProps, Values>({
    displayName: 'ProjectApplicationUserFormProps',
    mapPropsToValues: ({ currentUser, currentPublicUser }) => ({
      city:
        (currentUser &&
          currentUser.profile.address && {
            kind: AddressKind.WEAK,
            node: { description: currentUser.profile.address.typed_address },
          }) ||
        null,
      phone: (currentUser && currentUser.phone) || '',
      gender:
        (currentPublicUser &&
          currentPublicUser.profile &&
          currentPublicUser.profile.gender) ||
        'unspecified',
      birthday_date:
        (currentPublicUser &&
          currentPublicUser.profile &&
          currentPublicUser.profile.birthday_date &&
          formatToBRDate(currentPublicUser.profile.birthday_date)) ||
        '',
    }),
    handleSubmit: async (
      values,
      { setSubmitting, props: { onSubmit, onFinish } },
    ) => {
      await onSubmit({
        phone: values.phone,
        profile: {
          address: values.city
            ? {
                typed_address: values.city.node.description,
                typed_address2: '',
              }
            : null,
          gender: values.gender,
          birthday_date: formatToUSDate(values.birthday_date),
        },
      })

      onFinish()
      setSubmitting(false)
    },
    validationSchema: ProjectApplicationUserFormSchema,
  })(ProjectApplicationUserFormProps),
)
