import { InjectedFormikProps, withFormik } from 'formik'
import { NextPageContext, NextPage } from 'next'
import React from 'react'
import { connect } from 'react-redux'
import MaskedTextInput from 'react-text-mask'
import Textarea from 'react-textarea-autosize'
import ActivityIndicator from '~/components/ActivityIndicator'
import ErrorMessage from '~/components/Form/ErrorMessage'
import FormGroup from '~/components/Form/FormGroup'
import InputAddress, {
  AddressKind,
  InputAddressValueType,
} from '~/components/InputAddress/InputAddress'
import InputImage from '~/components/InputImage'
import { InputImageValueType } from '~/components/InputImage/InputImage'
import InputSelect from '~/components/InputSelect'
import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import Meta from '~/components/Meta'
import PublicUserLayout from '~/components/PublicUserLayout'
import { getPublicUserLayoutInitialProps } from '~/components/PublicUserLayout/PublicUserLayout'
import UserSettingsNav from '~/components/UserSettings/UserSettingsNav'
import * as masks from '~/lib/form/masks'
import { RE_DATE, RE_PHONE } from '~/lib/form/regex'
import Yup from '~/lib/form/yup'
import { NotFoundPageError } from '~/lib/next/errors'
import { causeToSelectItem, skillToSelectItem } from '~/lib/utils/form'
import { formatToBRDate, formatToUSDate } from '~/lib/utils/string'
import { PublicUser } from '~/redux/ducks/public-user'
import { User } from '~/redux/ducks/user'
import { updateUser, UserOverrides } from '~/redux/ducks/user-update'
import { RootState } from '~/redux/root-reducer'

interface SettingsUserPageProps {
  readonly isAuthenticatedUser?: boolean
  readonly publicUser?: PublicUser
  readonly currentUser?: User
  readonly onSubmit: (values: UserOverrides) => any
  readonly causesSelectItems: InputSelectItem[]
  readonly skillsSelectItems: InputSelectItem[]
}

interface Values {
  readonly name: string
  readonly description: string
  readonly phone: string
  readonly birthdate: string
  readonly gender: string
  readonly causes: InputSelectItem[]
  readonly skills: InputSelectItem[]
  readonly avatar?: InputImageValueType
  readonly city: InputAddressValueType
}

const SettingsUserPage: NextPage<
  InjectedFormikProps<SettingsUserPageProps, Values>,
  {}
> = ({
  publicUser,
  touched,
  handleChange,
  setFieldTouched,
  setFieldValue,
  handleBlur,
  errors,
  values,
  isSubmitting,
  handleSubmit,
  causesSelectItems,
  skillsSelectItems,
  status,
}) => {
  if (!publicUser) {
    return <PublicUserLayout />
  }

  return (
    <PublicUserLayout sidebar={<UserSettingsNav />}>
      <Meta title={publicUser.name} description={publicUser.profile.about} />
      <form method="POST" action="/settings/profile" onSubmit={handleSubmit}>
        <h4 className="tw-normal">Perfil publico</h4>
        <hr />
        <div className="row">
          <div className="col-lg-7 order-2 order-lg-1">
            <FormGroup
              labelFor="profile-input-name"
              label="Seu nome"
              error={touched.name ? errors.name : undefined}
              length={values.name.length}
              maxLength={150}
              className="mb-4"
            >
              <input
                id="profile-input-name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                className="input input--size-3"
              />
            </FormGroup>

            <FormGroup
              labelFor="profile-input-description"
              label="Sobre você"
              error={touched.description ? errors.description : undefined}
              length={values.description.length}
              maxLength={200}
              className="mb-4"
              required={false}
            >
              <Textarea
                id="profile-input-description"
                name="description"
                minRows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input input--size-3"
              />
            </FormGroup>

            <FormGroup
              labelFor="profile-input-phone"
              label="Telefone"
              error={touched.phone ? errors.phone : undefined}
              length={values.phone.length}
              className="mb-4"
              hint="Essa informação é obrigatória para se inscrever numa ação"
            >
              <MaskedTextInput
                id="profile-input-phone"
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
              labelFor="profile-input-birthdate"
              label="Data de nascimento"
              error={touched.birthdate ? errors.birthdate : undefined}
              length={values.birthdate.length}
              className="mb-4"
              hint="Essa informação é obrigatória para se inscrever numa ação"
            >
              <MaskedTextInput
                id="profile-input-birthdate"
                name="birthdate"
                value={values.birthdate}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input input--size-3"
                mask={masks.date}
                placeholder="__/__/____"
                guide={false}
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

            <FormGroup
              label="Cidade"
              labelFor="recover-input-city"
              error={touched.city ? errors.city : undefined}
              className="mb-4"
              hint="Comece a escrever e selecione uma opção"
            >
              <InputAddress
                id="recover-input-city"
                name="input-address"
                className="input input--size-3"
                placeholder="Cidade"
                address={values.city}
                onChange={newAddressValue =>
                  setFieldValue('city', newAddressValue)
                }
                onBlur={() => setFieldTouched('city', true)}
                options={{
                  types: ['(cities)'],
                }}
              />
            </FormGroup>

            <FormGroup
              labelFor="profile-input-causes"
              label="Causas"
              error={
                touched.causes ? ((errors.causes as any) as string) : undefined
              }
              className="mb-4"
              maxLength={3}
              length={values.causes.length}
            >
              <InputSelect
                inputClassName="input--size-3"
                selectedItems={values.causes}
                onChange={selectedItems =>
                  setFieldValue('causes', selectedItems)
                }
                onBlur={() => setFieldTouched('causes', true)}
                items={causesSelectItems}
              />
            </FormGroup>

            <FormGroup
              labelFor="profile-input-skills"
              label="Habilidades"
              error={
                touched.skills ? ((errors.skills as any) as string) : undefined
              }
              className="mb-4"
              maxLength={3}
              length={values.skills.length}
            >
              <InputSelect
                inputClassName="input--size-3"
                selectedItems={values.skills}
                onChange={selectedItems =>
                  setFieldValue('skills', selectedItems)
                }
                onBlur={() => setFieldTouched('skills', true)}
                items={skillsSelectItems}
              />
            </FormGroup>

            <p className="tc-muted ts-small">
              Todos os campos preenchidos nesta página podem ser excluídos a
              qualquer momento mediante solicitação, ao preenchê-los, você
              afirma estar ciente de estar nos dando direito de compartilhar
              estes dados e sua imagem em seu perfil e qualquer local que ele
              for vinculado. Por favor leia nossos termos de privacidade para
              saber mais como utilizamos suas informações.
            </p>
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
                Falha ao conectar-se com o servidor
              </ErrorMessage>
            )}
          </div>
          <div className="col-lg-4 offset-lg-1 mb-3 mb-lg-0 order-1 order-lg-2">
            <label htmlFor="profile-input-avatar" className="tw-medium">
              Foto de perfil
            </label>
            <InputImage
              id="profile-input-avatar"
              value={values.avatar}
              ratio={100}
              onChange={newImageValue => setFieldValue('avatar', newImageValue)}
              onBlur={() => setFieldTouched('avatar')}
            />
          </div>
        </div>
      </form>
    </PublicUserLayout>
  )
}

SettingsUserPage.displayName = 'SettingsUserPage'
SettingsUserPage.getInitialProps = async (context: NextPageContext) => {
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

const mapStateToProps = ({ startup, user, publicUser }: RootState) => ({
  isAuthenticatedUser: !!(
    publicUser.node &&
    user &&
    user.slug === publicUser.node.slug
  ),
  currentUser: user,
  publicUser: publicUser.node,
  causesSelectItems: startup.causes.map(causeToSelectItem),
  skillsSelectItems: startup.skills.map(skillToSelectItem),
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (values: UserOverrides) => dispatch(updateUser(values)),
})

const PublicUserEditSchema = Yup.object().shape({
  gender: Yup.string().required(),
  description: Yup.string()
    .min(4)
    .max(200),
  causes: Yup.array().max(3),
  name: Yup.string()
    .min(4)
    .max(150)
    .required(),
  city: Yup.object()
    .nullable(true)
    .required(),
  phone: Yup.string()
    .matches(RE_PHONE, 'Esse número de telefone não é válido')
    .required(),
  birthday_date: Yup.string().matches(RE_DATE, 'Essa data não é valida'),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik<SettingsUserPageProps, Values>({
    displayName: 'SettingsUserPageEdit',
    mapPropsToValues: ({ currentUser, publicUser }: SettingsUserPageProps) => ({
      name: (publicUser && publicUser.name) || '',
      description: (publicUser && publicUser.profile.about) || '',
      phone: (currentUser && currentUser.phone) || '',
      gender: (publicUser && publicUser.profile.gender) || '',
      image: null,
      skills:
        (publicUser &&
          publicUser.profile.skills &&
          publicUser.profile.skills.map(skillToSelectItem)) ||
        [],
      causes:
        (publicUser &&
          publicUser.profile.causes &&
          publicUser.profile.causes.map(causeToSelectItem)) ||
        [],
      avatar:
        publicUser && publicUser.avatar
          ? {
              previewURI: publicUser.avatar.image_url,
            }
          : null,
      city:
        (publicUser &&
          publicUser.profile.address && {
            kind: AddressKind.WEAK,
            node: { description: publicUser.profile.address.typed_address },
          }) ||
        null,
      birthdate:
        (publicUser &&
          publicUser.profile.birthday_date &&
          formatToBRDate(publicUser.profile.birthday_date)) ||
        '',
    }),
    validationSchema: PublicUserEditSchema,
    handleSubmit: async (
      values,
      { setSubmitting, setStatus, props: { onSubmit } },
    ) => {
      try {
        const action = await onSubmit({
          name: values.name,
          phone: values.phone,
          avatar: values.avatar
            ? values.avatar.payload
              ? values.avatar.payload.id
              : undefined
            : null,
          profile: {
            address: values.city
              ? {
                  typed_address: values.city.node.description,
                  typed_address2: '',
                }
              : null,
            causes: values.causes.map(item => ({ id: item.value as number })),
            skills: values.skills.map(item => ({ id: item.value as number })),
            gender: values.gender,
            about: values.description,
            birthday_date: values.birthdate
              ? formatToUSDate(values.birthdate)
              : null,
          },
        })
        if (action.error) {
          setStatus(action.payload)
        }

        setSubmitting(false)
      } catch (error) {
        setStatus(error)
      }
    },
  })(SettingsUserPage),
)
