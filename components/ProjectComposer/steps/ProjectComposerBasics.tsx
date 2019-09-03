import { InjectedFormikProps, withFormik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import MaskedTextInput from 'react-text-mask'
import Textarea from 'react-textarea-autosize'
import { DropdownDirection } from '~/components/Dropdown/Dropdown'
import FormGroup from '~/components/Form/FormGroup'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import InputAddress from '~/components/InputAddress'
import {
  AddressKind,
  InputAddressValueType,
} from '~/components/InputAddress/InputAddress'
import InputImage, {
  InputImageValueType,
} from '~/components/InputImage/InputImage'
import InputSelect, {
  InputSelectItem,
} from '~/components/InputSelect/InputSelect'
import asFormStep, {
  InjectedMultipleStepsFormProps,
} from '~/components/MultipleStepsForm/as-form-step'
import ProjectComposerCard from '~/components/ProjectComposer/components/ProjectComposerCard'
import useFetchAPI from '~/hooks/use-fetch-api'
import * as masks from '~/lib/form/masks'
import Yup from '~/lib/form/yup'
import { causeToSelectItem, skillToSelectItem } from '~/lib/utils/form'
import { hasQuerySucceeded } from '~/lib/utils/graphql'
import { Project } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { OrganizationMember } from '~/types/api'

const ProjectBasicsFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .max(150)
    .required(),
  description: Yup.string()
    .min(4)
    .max(160)
    .required(),
  image: Yup.object()
    .nullable(true)
    .shape({
      payload: Yup.object().required(),
      fetching: Yup.boolean().notOneOf([false]),
    })
    .required(),
  addressComplement: Yup.string().max(160),
  causes: Yup.array()
    .min(1)
    .max(3),
  skills: Yup.array()
    .min(1)
    .max(3),
  owner_id: Yup.string().required(),
  address: Yup.object()
    .nullable(true)
    .required(),
})

export interface Values {
  readonly name: string
  readonly benefitedPeople: string
  readonly description: string
  readonly image?: InputImageValueType
  readonly address?: InputAddressValueType
  readonly addressComplement: string
  readonly causes: InputSelectItem[]
  readonly skills: InputSelectItem[]
  readonly owner_id: string
}

interface ProjectComposerBasicsProps
  extends InjectedMultipleStepsFormProps<any, any, any> {
  readonly className?: string
  readonly currentUser: User
  readonly causesSelectItems: InputSelectItem[]
  readonly skillsSelectItems: InputSelectItem[]
}

const ProjectComposerBasics: React.FC<
  InjectedFormikProps<ProjectComposerBasicsProps, Values>
> = ({
  handleChange,
  isValid,
  errors,
  values,
  touched,
  handleSubmit,
  causesSelectItems,
  skillsSelectItems,
  isFormSubmitting,
  setFieldTouched,
  setFieldValue,
  currentUser,
  formContext: { organization, mode },
}) => {
  const handleBlur = useCallback(() => {
    setFieldTouched('causes')
  }, [setFieldTouched])
  const handleAddressBlur = useCallback(() => {
    setFieldTouched('address')
  }, [setFieldTouched])
  const handleImageBlur = useCallback(() => {
    setFieldTouched('image')
  }, [setFieldTouched])
  const handleCausesBlur = useCallback(() => {
    setFieldTouched('causes')
  }, [setFieldTouched])
  const handleSkillsBlur = useCallback(() => {
    setFieldTouched('skills')
  }, [setFieldTouched])

  const handleImageChange = useCallback(
    newValue => {
      setFieldValue('image', newValue)
    },
    [setFieldValue],
  )
  const handleAddressChange = useCallback(
    newValue => {
      setFieldValue('address', newValue)
    },
    [setFieldValue],
  )
  const handleCausesChange = useCallback(
    newValue => {
      setFieldValue('causes', newValue)
    },
    [setFieldValue],
  )
  const handleSkillsChange = useCallback(
    newValue => {
      setFieldValue('skills', newValue)
    },
    [setFieldValue],
  )
  const queryMembers = useFetchAPI<OrganizationMember[]>(
    `/organizations/${organization ? organization.slug : ''}/members/`,
    {
      skip: !organization,
    },
  )

  const members: OrganizationMember[] = useMemo(() => {
    return (hasQuerySucceeded(queryMembers) && queryMembers.data!) || []
  }, [queryMembers])

  return (
    <FormComposerLayout
      onSubmit={handleSubmit}
      isSubmitting={isFormSubmitting}
      disabled={!isValid}
      helpPanelChildren={
        <div className="px-3 py-5">
          <span className="tc-muted tw-medium ts-small mb-3 block ta-center">
            COMO SUA VAGA VAI SER VISTA:
          </span>
          <ProjectComposerCard values={values} className="mx-auto" />
        </div>
      }
    >
      {mode !== FormComposerMode.EDIT && (
        <h4 className="tc-muted ts-small">ETAPA 1</h4>
      )}
      <h1 className="tw-light mb-1">Informações gerais</h1>
      <p className="ts-medium tc-muted-dark mb-4">Preencha as informações</p>

      <FormGroup
        labelFor="project-input-name"
        label="Nome da vaga"
        error={touched.name ? errors.name : undefined}
        length={values.name.length}
        maxLength={150}
        className="mb-4"
        hint="Coloque um nome atrativo, algo que chame a atenção dos voluntários."
      >
        <input
          id="project-input-name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          className="input input--size-4"
          placeholder="Ex.: Descarte latas #Cestou"
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-description"
        label="Resumo"
        error={touched.description ? errors.description : undefined}
        length={values.description.length}
        maxLength={160}
        className="mb-4"
        hint="Faça uma chamada atrativa e resumida do trabalho. Seja convidativo (a), pois essa será a 1ª impressão que o voluntário terá da vaga."
      >
        <Textarea
          id="project-input-description"
          name="description"
          minRows={3}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ex.: Dia 09/04 faremos instalação de cestas para o descarte exclusivo de latas, facilitando a coleta pelos catadores. Faça parte dessa intervenção urbana e coletiva."
          className="input input--size-4"
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-image"
        label="Imagem"
        error={
          touched.image
            ? errors.image && ((errors.image as any).payload || errors.image)
            : undefined
        }
        className="mb-4"
        hint="Assim como o nome, a imagem deve ser bem atrativa e relacionada com a vaga!"
      >
        <InputImage
          hint={
            <>
              Carregue uma imagem no formato JPG, JPEG, PNG ou GIF de no máximo
              2MB.
            </>
          }
          value={values.image}
          ratio={66.666666666}
          onChange={handleImageChange}
          onBlur={handleImageBlur}
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-address"
        label="Endereço"
        error={touched.address ? (errors.address as string) : undefined}
        className="mb-3"
        hint="Comece a escrever e selecione uma opção"
      >
        <InputAddress
          id="project-input-address"
          name="address"
          address={values.address}
          onChange={handleAddressChange}
          onBlur={handleAddressBlur}
          className="input input--size-4"
        />
      </FormGroup>
      <input
        type="text"
        name="addressComplement"
        className="input input--size-4 w-50 mb-3"
        placeholder="Complemento"
        value={values.addressComplement}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormGroup
        labelFor="project-input-causes"
        label="Causas"
        error={touched.causes ? ((errors.causes as any) as string) : undefined}
        length={values.causes.length}
        className="mb-4"
        maxLength={3}
        hint="Selecione até 3 causas que melhor definem a vaga"
      >
        <InputSelect
          inputClassName="input--size-4"
          selectedItems={values.causes}
          onChange={handleCausesChange}
          onBlur={handleCausesBlur}
          items={causesSelectItems}
          direction={DropdownDirection.UP}
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-skills"
        label="Habilidades possíveis para a vaga"
        error={touched.skills ? ((errors.skills as any) as string) : undefined}
        length={values.skills.length}
        className="mb-4"
        maxLength={3}
        hint="Selecione uma ou mais habilidades para o voluntário"
      >
        <InputSelect
          inputClassName="input--size-4"
          selectedItems={values.skills}
          onChange={handleSkillsChange}
          onBlur={handleSkillsBlur}
          items={skillsSelectItems}
          direction={DropdownDirection.UP}
        />
      </FormGroup>

      <FormGroup
        labelFor="ong-input-benefited-people"
        label="Número de beneficiados"
        error={
          touched.benefitedPeople
            ? (errors.benefitedPeople as string)
            : undefined
        }
        className="mb-3"
        hint="Estimativa do número de pessoas impactadas"
        required={false}
      >
        <MaskedTextInput
          id="ong-input-benefited-people"
          name="benefitedPeople"
          value={values.benefitedPeople}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input--size-3"
          mask={masks.numeral}
          guide={false}
        />
      </FormGroup>
      {organization && (
        <FormGroup
          labelFor="project-input-owner_id"
          label="Responsável da vaga"
          error={touched.owner_id ? errors.owner_id : undefined}
          className="mb-4"
          hint="Selecione a pessoa que será responsável pela coordanação dos voluntários. Ela ficará responsável por respondê-los."
        >
          <select
            id="project-input-owner_id"
            name="owner_id"
            value={values.owner_id}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input input--size-4"
          >
            <option value="">Selecione um membro da ONG</option>
            {members.map(member => (
              <option key={member.uuid} value={member.uuid}>
                {member.name}{' '}
                {currentUser.slug === member.slug ? ' (Você)' : ''}
              </option>
            ))}
          </select>
        </FormGroup>
      )}
    </FormComposerLayout>
  )
}

ProjectComposerBasics.displayName = 'ProjectComposerBasics'

const mapStateToProps = ({ user, startup }) => {
  return {
    currentUser: user!,
    causesSelectItems: startup.causes.map(causeToSelectItem),
    skillsSelectItems: startup.skills.map(skillToSelectItem),
  }
}

const mapPropsToValues = ({
  formContext: { organization },
  currentUser,
  value = {},
}: ProjectComposerBasicsProps): Values => ({
  name: value.name || '',
  description: value.description || '',
  addressComplement: (value.address && value.address.typed_address2) || '',
  causes: value.causes ? value.causes.map(causeToSelectItem) : [],
  skills: value.skills ? value.skills.map(skillToSelectItem) : [],
  address: value.address
    ? {
        kind: AddressKind.WEAK,
        node: { description: value.address.typed_address },
      }
    : null,
  image: value.image
    ? { previewURI: value.image.image_url, payload: value.image }
    : null,
  owner_id: value.owner
    ? value.owner.uuid
    : value.owner_id ||
      (organization ? '' : currentUser ? currentUser.uuid : ''),
  benefitedPeople: value.benefited_people,
})

export default asFormStep(
  'geral',
  {
    label: 'Informações Gerais',
    isDone: (value: Partial<Project>) =>
      ProjectBasicsFormSchema.isValidSync(
        mapPropsToValues({ formContext: {}, value } as any),
      ),
  },
  connect(mapStateToProps)(
    withFormik<ProjectComposerBasicsProps, Values>({
      displayName: 'ProjectComposerBasicsForm',
      handleSubmit: (values, { props: { onSubmit } }) => {
        onSubmit(project => ({
          ...project,
          name: values.name,
          description: values.description,
          address: (values.address || values.addressComplement) && {
            typed_address:
              values.address &&
              values.address.node &&
              values.address.node.description,
            typed_address2: values.addressComplement,
          },
          causes: values.causes.map(item => ({
            id: item.value,
            name: item.label,
          })),
          skills: values.skills.map(item => ({
            id: item.value,
            name: item.label,
          })),
          image_id:
            values.image && values.image.payload && values.image.payload.id,
          image: values.image && values.image.payload,
          owner_id: values.owner_id,
          benefited_people: parseInt(values.benefitedPeople, 10),
        }))
      },
      isInitialValid: (props: ProjectComposerBasicsProps) =>
        props.value
          ? ProjectBasicsFormSchema.isValidSync(mapPropsToValues(props))
          : false,
      validationSchema: ProjectBasicsFormSchema,
      mapPropsToValues,
    })(ProjectComposerBasics),
  ),
)
