import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { InjectedFormikProps, withFormik } from 'formik'
import { connect, useSelector } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import MaskedTextInput from 'react-text-mask'
import React, { useEffect } from 'react'
import { NextPage } from 'next'

import Yup, { YupDateErrorMessage, YupPhoneErrorMessage } from '~/lib/form/yup'
import { InputImageValueType } from '~/components/InputImage/InputImage'
import { causeToSelectItem, skillToSelectItem } from '~/lib/utils/form'
import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import { updateUser, UserOverrides } from '~/redux/ducks/user-update'
import { formatToBRDate, formatToUSDate } from '~/lib/utils/string'
import ActivityIndicator from '~/components/ActivityIndicator'
import ErrorMessage from '~/components/Form/ErrorMessage'
import { PublicUser } from '~/redux/ducks/public-user'
import useStartupData from '~/hooks/use-startup-data'
import { RE_DATE, RE_PHONE } from '~/lib/form/regex'
import FormGroup from '~/components/Form/FormGroup'
import InputSelect from '~/components/InputSelect'
import InputImage from '~/components/InputImage'
import { RootState } from '~/redux/root-reducer'
import * as masks from '~/lib/form/masks'
import Meta from '~/components/Meta'
import InputAddress, {
  AddressKind,
  InputAddressValueType,
} from '~/components/InputAddress/InputAddress'
import {
  ViewerSettingsLayout,
  getViewerSettingsInitialProps,
} from '~/components/ViewerSettings'

import useFetchAPI from '../hooks/use-fetch-api'
import { reportError } from '../lib/utils/error'
import Icon from '../components/Icon'
import { Color } from '../common'

interface SettingsUserPageProps {
  readonly onSubmit: (values: UserOverrides) => any
}

const m = defineMessages({
  'Seu nome': {
    id: 'settingsUser.name',
    defaultMessage: 'Seu nome',
  },
  'Sobre você': {
    id: 'settingsUser.about',
    defaultMessage: 'Sobre você',
  },
  Telefone: {
    id: 'settingsUser.phone',
    defaultMessage: 'Telefone',
  },
  'Data de nascimento': {
    id: 'settingsUser.birthdate',
    defaultMessage: 'Data de nascimento',
  },
  Gênero: {
    id: 'settingsUser.gender',
    defaultMessage: 'Gênero',
  },
  Cidade: {
    id: 'settingsUser.city',
    defaultMessage: 'Cidade',
  },
  Causas: {
    id: 'settingsUser.causes',
    defaultMessage: 'Causas',
  },
  Habilidades: {
    id: 'settingsUser.skills',
    defaultMessage: 'Habilidades',
  },
  requiredToSubscribe: {
    id: 'settingsUser.requiredToSubscribe',
    defaultMessage: 'Essa informação é obrigatória para se inscrever numa ação',
  },
  inputAddressHint: {
    id: 'settingsUser.inputAddressHint',
    defaultMessage: 'Comece a escrever e selecione uma opção',
  },
  notSpecified: { id: 'NAO_ESPECIFICADO', defaultMessage: 'Não especificado' },
  genderMale: { id: 'settingsUser.gender.male', defaultMessage: 'Masculino' },
  genderFemale: {
    id: 'settingsUser.gender.female',
    defaultMessage: 'Feminino',
  },
})

const publicUserToValues = ({
  name,
  avatar,
  phone,
  profile,
}: PublicUser): Values => ({
  name,
  phone: phone || '',
  description: profile?.about || '',
  gender: profile?.gender || '',
  skills: profile?.skills ? profile?.skills.map(skillToSelectItem) : [],
  causes: profile?.causes ? profile?.causes.map(causeToSelectItem) : [],
  avatar: avatar ? { previewURI: avatar.image_url } : null,
  city: profile?.address
    ? {
        kind: AddressKind.WEAK,
        node: { description: profile?.address.typed_address },
      }
    : null,
  birthdate: profile?.birthday_date
    ? formatToBRDate(profile?.birthday_date)
    : '',
})

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
  touched,
  handleChange,
  setFieldTouched,
  setFieldValue,
  setValues,
  handleBlur,
  errors,
  values,
  isSubmitting,
  handleSubmit,
  status,
}) => {
  const { data: startup, loading: startupLoading } = useStartupData()

  const causesSelectItems = startup?.causes?.map(causeToSelectItem)
  const skillsSelectItems = startup?.skills?.map(skillToSelectItem)

  const { viewer } = useSelector((state: RootState) => ({
    viewer: state.user!,
  }))
  const intl = useIntl()
  const publicUserQuery = useFetchAPI<PublicUser>(
    `/public-users/${viewer && viewer.slug}/`,
    { skip: !viewer },
  )
  const publicUser = publicUserQuery.data
  useEffect(() => {
    if (publicUser) {
      setValues(publicUserToValues({ ...viewer, ...publicUser }))
    }
  }, [publicUser])
  const loading = !publicUser || startupLoading || !startup

  if (loading) {
    return (
      <ViewerSettingsLayout>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <ActivityIndicator fill={Color.gray[500]} size={52} />
        </div>
      </ViewerSettingsLayout>
    )
  }

  return (
    <ViewerSettingsLayout>
      <Meta title={publicUser?.name} description={publicUser?.profile?.about} />
      <div className="bg-white rounded-lg shadow">
        <div className="py-4 px-4">
          <h4 className="font-normal mb-0 text-xl leading-loose">
            <Icon
              name="person"
              className="bg-gray-200 rounded-full w-10 h-10 text-center mr-4"
            />
            <FormattedMessage
              id="pages.settingsUser.title"
              defaultMessage="Meu perfil de voluntário"
            />
          </h4>
        </div>
        <form
          method="POST"
          action="/settings/profile"
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-5"
        >
          <div className="w-48 mx-auto mb-6">
            <InputImage
              id="profile-input-avatar"
              value={values.avatar}
              ratio={100}
              onChange={newImageValue => setFieldValue('avatar', newImageValue)}
              onBlur={() => setFieldTouched('avatar')}
              className="rounded-full"
            />
          </div>
          <FormGroup
            labelFor="profile-input-name"
            label={intl.formatMessage(m['Seu nome'])}
            error={touched.name ? errors.name : undefined}
            length={values.name.length}
            maxLength={150}
            className="mb-6"
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
            label={intl.formatMessage(m['Sobre você'])}
            error={touched.description ? errors.description : undefined}
            length={values.description.length}
            maxLength={200}
            className="mb-6"
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
            label={intl.formatMessage(m.Telefone)}
            error={touched.phone ? errors.phone : undefined}
            length={values.phone.length}
            className="mb-6"
            hint={intl.formatMessage(m.requiredToSubscribe)}
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
            label={intl.formatMessage(m['Data de nascimento'])}
            error={touched.birthdate ? errors.birthdate : undefined}
            length={values.birthdate.length}
            className="mb-6"
            hint={intl.formatMessage(m.requiredToSubscribe)}
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
            label={intl.formatMessage(m.Gênero)}
            error={touched.gender ? errors.gender : undefined}
            length={values.gender.length}
            className="mb-6"
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
              <option value="unspecified">
                {intl.formatMessage(m.notSpecified)}
              </option>
              <option value="male">{intl.formatMessage(m.genderMale)}</option>
              <option value="female">
                {intl.formatMessage(m.genderFemale)}
              </option>
            </select>
          </FormGroup>

          <FormGroup
            label={intl.formatMessage(m.Cidade)}
            labelFor="recover-input-city"
            error={touched.city ? errors.city : undefined}
            className="mb-6"
            hint={intl.formatMessage(m.inputAddressHint)}
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
            label={intl.formatMessage(m.Causas)}
            error={
              touched.causes ? ((errors.causes as any) as string) : undefined
            }
            className="mb-6"
            maxLength={3}
            length={values.causes.length}
          >
            <InputSelect
              inputClassName="input--size-3"
              selectedItems={values.causes}
              onChange={selectedItems => setFieldValue('causes', selectedItems)}
              onBlur={() => setFieldTouched('causes', true)}
              items={causesSelectItems}
            />
          </FormGroup>

          <FormGroup
            labelFor="profile-input-skills"
            label={intl.formatMessage(m.Habilidades)}
            error={
              touched.skills ? ((errors.skills as any) as string) : undefined
            }
            className="mb-6"
            maxLength={3}
            length={values.skills.length}
          >
            <InputSelect
              inputClassName="input--size-3"
              selectedItems={values.skills}
              onChange={selectedItems => setFieldValue('skills', selectedItems)}
              onBlur={() => setFieldTouched('skills', true)}
              items={skillsSelectItems}
            />
          </FormGroup>

          <p className="text-gray-600 text-sm">
            <FormattedMessage
              id="settingsUser.text"
              defaultMessage="Todos os campos preenchidos nesta página podem ser excluídos a
            qualquer momento mediante solicitação, ao preenchê-los, você afirma
            estar ciente de estar nos dando direito de compartilhar estes dados
            e sua imagem em seu perfil e qualquer local que ele for vinculado.
            Por favor leia nossos termos de privacidade para saber mais como
            utilizamos suas informações."
            />
          </p>
          <button
            type="submit"
            className="btn px-3 text-lg py-3 rounded text-white bg-primary-500 hover:bg-primary-600 w-full"
            disabled={isSubmitting}
          >
            <FormattedMessage
              id="settingsUser.submit"
              defaultMessage="Salvar alterações"
            />
            {isSubmitting && (
              <ActivityIndicator size={36} fill="white" className="ml-1" />
            )}
          </button>
          {status && (
            <ErrorMessage className="mt-2">
              <FormattedMessage
                id="settingsUser.error"
                defaultMessage="Falha ao conectar-se com o servidor"
              />
            </ErrorMessage>
          )}
        </form>
      </div>
    </ViewerSettingsLayout>
  )
}

SettingsUserPage.displayName = 'SettingsUserPage'
SettingsUserPage.getInitialProps = getViewerSettingsInitialProps

const PublicUserEditSchema = Yup.object().shape({
  gender: Yup.string().required(),
  description: Yup.string()
    .min(4)
    .max(200),
  causes: Yup.array().max(3),
  skills: Yup.array().max(3),
  name: Yup.string()
    .min(4)
    .max(150)
    .required(),
  city: Yup.object()
    .nullable(true)
    .required(),
  phone: Yup.string()
    .matches(RE_PHONE, YupPhoneErrorMessage)
    .required(),
  birthdate: Yup.string().matches(RE_DATE, YupDateErrorMessage),
})

export default connect(undefined, { onSubmit: updateUser })(
  withFormik<SettingsUserPageProps, Values>({
    displayName: 'SettingsUserPageEdit',
    mapPropsToValues: () => ({
      name: '',
      description: '',
      phone: '',
      gender: '',
      image: null,
      skills: [],
      causes: [],
      avatar: null,
      city: null,
      birthdate: '',
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
        reportError(error)
        setStatus(error)
      }
    },
  })(SettingsUserPage),
)
