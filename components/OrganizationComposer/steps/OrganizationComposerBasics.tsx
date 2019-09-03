import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import MaskedTextInput from 'react-text-mask'
import Textarea from 'react-textarea-autosize'
import { DropdownDirection } from '~/components/Dropdown/Dropdown'
import FormGroup from '~/components/Form/FormGroup'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import Icon from '~/components/Icon'
import InputAddress from '~/components/InputAddress'
import { InputAddressValueType } from '~/components/InputAddress/InputAddress'
import InputImage from '~/components/InputImage'
import { InputImageValueType } from '~/components/InputImage/InputImage'
import InputSelect, {
  InputSelectItem,
} from '~/components/InputSelect/InputSelect'
import { fetchAPI } from '~/lib/fetch'
import * as masks from '~/lib/form/masks'
import Yup from '~/lib/form/yup'
import { causeToSelectItem } from '~/lib/utils/form'
import OrganizationComposerCard from '../components/OrganizationComposerCard'

const RE_CNPJ = /^[0-9]{2}.[0-9]{3}.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/
const OrganizationBasicsFormSchema = Yup.object().shape({
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
  causes: Yup.array().max(3),
  address: Yup.object()
    .nullable(true)
    .required(),
  cnpj: Yup.string()
    .matches(RE_CNPJ, 'Este CNPJ está no formato incorreto')
    .test('is-valid', 'Este CNPJ não é valido ou já está sendo usado', function(
      value,
    ) {
      if (!value) {
        return true
      }

      if (!RE_CNPJ.test(value)) {
        return true
      }

      if (value === this.parent.defaultCnpj) {
        return true
      }

      return fetchAPI<{ taken?: boolean; invalid?: boolean }>(
        `/organizations/check-doc/${value.replace(/[^0-9]/g, '')}`,
      )
        .then(payload => !payload.taken && !payload.invalid)
        .catch(() => false)
    }),
})

export interface Values {
  readonly name: string
  readonly benefitedPeople: string
  readonly description: string
  readonly image?: InputImageValueType
  readonly address?: InputAddressValueType
  readonly addressComplement: string
  readonly causes: InputSelectItem[]
  readonly cnpj: string
  readonly defaultCnpj: string
  readonly show_address: boolean
}

interface OrganizationComposerBasicsProps {
  readonly className?: string
  readonly isComposerSubmitting?: boolean
  readonly mode: FormComposerMode
  readonly onSubmit: (values: Values) => void
  readonly onChange: (values: Values) => void
  readonly defaultValue?: Values
  readonly causesSelectItems: InputSelectItem[]
}

class OrganizationComposerBasics extends React.Component<
  OrganizationComposerBasicsProps &
    InjectedFormikProps<OrganizationComposerBasicsProps, Values>
> {
  public static isValidValue = (values: Values): Promise<boolean> => {
    return OrganizationBasicsFormSchema.isValid(values)
  }

  public draftTimeout: number
  public handleBlur = (event: React.FocusEvent) => {
    const { handleBlur } = this.props
    handleBlur(event)
    this.saveDraft()
  }

  public saveDraft = () => {
    const { onChange } = this.props

    if (this.draftTimeout) {
      clearTimeout(this.draftTimeout)
    }

    this.draftTimeout = window.setTimeout(() => {
      onChange({
        ...this.props.values,
        cnpj: '',
      })
    }, 1000)
  }

  public handleAddressBlur = () => {
    this.props.setFieldTouched('address')
    this.saveDraft()
  }

  public handleAddressChange = (newValue: InputAddressValueType) => {
    this.props.setFieldValue('address', newValue)
  }

  public handleCausesBlur = () => {
    this.props.setFieldTouched('causes')
    this.saveDraft()
  }

  public handleCausesChange = (newValue: InputSelectItem[]) => {
    this.props.setFieldValue('causes', newValue)
  }

  public handleImageBlur = () => {
    this.props.setFieldTouched('image')
    this.saveDraft()
  }

  public handleImageChange = (newValue: InputImageValueType) => {
    this.props.setFieldValue('image', newValue)
  }

  public render() {
    const {
      className,
      handleChange,
      isValid,
      errors,
      values,
      touched,
      mode,
      handleSubmit,
      causesSelectItems,
      isComposerSubmitting,
    } = this.props

    return (
      <FormComposerLayout
        disabled={!isValid}
        onSubmit={handleSubmit}
        className={className}
        isSubmitting={isComposerSubmitting}
        mode={mode}
        helpPanelChildren={
          <div className="p-5">
            <h4 className="tw-normal ts-normal tc-muted-dark mb-4">
              <Icon
                name="lightbulb_outline"
                className="mr-1 tc-secondary-500"
              />
              Como sua ONG será vista:
            </h4>
            <OrganizationComposerCard {...values} />
          </div>
        }
      >
        {mode !== FormComposerMode.EDIT && (
          <h4 className="tc-muted ts-small">ETAPA 1</h4>
        )}
        <h1 className="tw-light mb-1">Sua ONG</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          Preencha as informações abaixo:
        </p>

        <FormGroup
          labelFor="ong-input-name"
          label="Nome da ONG"
          error={touched.name ? errors.name : undefined}
          length={values.name.length}
          maxLength={150}
          className="mb-4"
        >
          <input
            id="ong-input-name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={this.handleBlur}
            type="text"
            className="input input--size-3"
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-description"
          label="Resumo da ONG"
          error={touched.description ? errors.description : undefined}
          length={values.description.length}
          maxLength={160}
          className="mb-4"
          hint="Faça uma descrição atrativa e resumida do trabalho da ONG!"
        >
          <Textarea
            id="ong-input-description"
            name="description"
            minRows={3}
            value={values.description}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            placeholder="Ex.: Somos uma rede que tem como objetivo aumentar o impacto das organizações sociais por meio da mobilização de pessoas."
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-image"
          label="Imagem"
          error={
            touched.image
              ? errors.image && ((errors.image as any).payload || errors.image)
              : undefined
          }
          className="mb-4"
          hint={
            <>
              Insira o logo da sua ONG. <br />
              Caso não tenha, coloque uma foto que melhor a represente.
            </>
          }
        >
          <InputImage
            hint={
              <>
                Carregue uma imagem no formato JPG, JPEG, PNG ou GIF de no
                máximo 2MB.
                <br />
                <br /> Prefira imagens no formato quadrado, caso contrário a
                imagem será cortada e centralizada para melhor visualização.
              </>
            }
            value={values.image}
            ratio={100}
            onChange={this.handleImageChange}
            onBlur={this.handleImageBlur}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-address"
          label="Endereço"
          error={touched.address ? (errors.address as string) : undefined}
          className="mb-3"
          hint="Comece a escrever e selecione uma opção"
        >
          <InputAddress
            id="ong-input-address"
            name="address"
            address={values.address}
            onChange={this.handleAddressChange}
            onBlur={this.handleAddressBlur}
            className="input input--size-3"
          />
        </FormGroup>
        <input
          type="text"
          name="addressComplement"
          className="input input--size-3 w-50 mb-3"
          placeholder="Complemento"
          value={values.addressComplement}
          onChange={handleChange}
          onBlur={this.handleBlur}
        />
        <label htmlFor="ong-input-hide-address" className="mb-4">
          <input
            id="ong-input-hide-address"
            name="show_address"
            type="checkbox"
            className="input mr-2"
            checked={values.show_address}
            onChange={handleChange}
            onBlur={this.handleBlur}
          />
          Mostrar endereço na página da ONG
        </label>

        <FormGroup
          labelFor="ong-input-causes"
          label="Causas"
          error={
            touched.causes ? ((errors.causes as any) as string) : undefined
          }
          length={values.causes.length}
          className="mb-4"
          maxLength={3}
          hint="Selecione até 3 causas que melhor definam o trabalho da ONG"
        >
          <InputSelect
            inputClassName="input--size-3"
            selectedItems={values.causes}
            onChange={this.handleCausesChange}
            onBlur={this.handleCausesBlur}
            items={causesSelectItems}
            direction={DropdownDirection.UP}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-benefited-people"
          label="Número de beneficiados"
          className="mb-3"
          hint="Estimativa do número de pessoas impactadas"
          required={false}
        >
          <MaskedTextInput
            id="ong-input-benefited-people"
            name="benefitedPeople"
            value={values.benefitedPeople}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            mask={masks.numeral}
            guide={false}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-cnpj"
          label="CNPJ"
          error={touched.cnpj ? errors.cnpj : undefined}
          length={values.cnpj.length}
          required={false}
        >
          <MaskedTextInput
            id="ong-input-cnpj"
            name="cnpj"
            value={values.cnpj}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            mask={masks.companyRegistrationId}
            placeholder="__.___.___/____-__"
            guide={false}
          />
        </FormGroup>
      </FormComposerLayout>
    )
  }
}

const defaultValue: Values = {
  name: '',
  description: '',
  causes: [],
  cnpj: '',
  defaultCnpj: '',
  addressComplement: '',
  show_address: true,
  benefitedPeople: '',
}

const mapStateToProps = ({ startup }) => ({
  causesSelectItems: startup.causes.map(causeToSelectItem),
})

export default connect(mapStateToProps)(
  withFormik<OrganizationComposerBasicsProps, Values>({
    displayName: 'OrganizationComposerBasicsForm',
    handleSubmit: (values, { props: { onSubmit } }) => {
      onSubmit(values)
    },
    isInitialValid: (props: OrganizationComposerBasicsProps) => {
      if (props.mode === FormComposerMode.EDIT) {
        return true
      }

      return props.defaultValue
        ? OrganizationBasicsFormSchema.isValidSync({
            ...props.defaultValue,
            cnpj: undefined,
          })
        : false
    },
    validationSchema: OrganizationBasicsFormSchema,
    mapPropsToValues: ({ defaultValue: value = defaultValue }) => ({
      name: value.name,
      benefitedPeople: value.benefitedPeople,
      description: value.description,
      addressComplement: value.addressComplement,
      causes: value.causes,
      address: value.address || null,
      image: value.image || null,
      cnpj: value.cnpj,
      defaultCnpj: value.cnpj,
      show_address: value.show_address,
    }),
  })(OrganizationComposerBasics),
)
