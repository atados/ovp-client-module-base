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
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

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

const {
  COMO_SERA_VISTA,
  ETAPA1,
  SUA_ONG,
  PREENCHA,
  NOME,
  RESUMO,
  RESUMO_HINT,
  RESUMO_PLACEHOLDER,
  IMAGEM,
  IMAGEM_HINT,
  IMAGEM_HINT2,
  ENDERECO,
  ENDERECO_HINT,
  COMPLEMENTO,
  ENDERECO_PLACEHOLDER,
  CAUSAS,
  CAUSAS_HINT,
  BENEFICIADOS,
  BENEFICIADOS_HINT,
} = defineMessages({
  COMO_SERA_VISTA: {
    id: 'COMO_SERA_VISTA',
    defaultMessage: 'Como sua ONG será vista:',
  },
  ETAPA1: {
    id: 'ETAPA1',
    defaultMessage: 'Descreva as atividades que o voluntário (a) irá realizar;',
  },
  SUA_ONG: {
    id: 'SUA_ONG',
    defaultMessage: 'Sua ONG',
  },
  PREENCHA: {
    id: 'PREENCHA',
    defaultMessage: 'Preencha as informações abaixo:',
  },
  NOME: {
    id: 'NOME',
    defaultMessage: 'Nome da ONG',
  },
  RESUMO: {
    id: 'RESUMO',
    defaultMessage: 'Resumo da ONG',
  },
  RESUMO_HINT: {
    id: 'RESUMO_HINT',
    defaultMessage:
      'Faça uma descrição atrativa e resumida do trabalho da ONG!',
  },
  RESUMO_PLACEHOLDER: {
    id: 'RESUMO_PLACEHOLDER',
    defaultMessage:
      'Ex.: Somos uma rede que tem como objetivo aumentar o impacto das organizações sociais por meio da mobilização de pessoas.',
  },
  IMAGEM: {
    id: 'IMAGEM',
    defaultMessage: 'Imagem',
  },
  IMAGEM_HINT: {
    id: 'IMAGEM_HINT',
    defaultMessage:
      'Insira o logo da sua ONG. Caso não tenha, coloque uma foto que melhor a represente.',
  },
  IMAGEM_HINT2: {
    id: 'IMAGEM_HINT2',
    defaultMessage:
      'Carregue uma imagem no formato JPG, JPEG, PNG ou GIF de no máximo 2MB. Prefira imagens no formato quadrado, caso contrário a imagem será cortada e centralizada para melhor visualização.',
  },
  ENDERECO: {
    id: 'ENDERECO',
    defaultMessage: 'Endereço',
  },
  ENDERECO_HINT: {
    id: 'ENDERECO_HINT',
    defaultMessage: 'Comece a escrever e selecione uma opção',
  },
  COMPLEMENTO: {
    id: 'COMPLEMENTO',
    defaultMessage: 'Complemento',
  },
  ENDERECO_PLACEHOLDER: {
    id: 'ENDERECO_PLACEHOLDER',
    defaultMessage: 'Mostrar endereço na página da ONG',
  },
  CAUSAS: {
    id: 'CAUSAS',
    defaultMessage: 'Causas',
  },
  CAUSAS_HINT: {
    id: 'CAUSAS_HINT',
    defaultMessage:
      'Selecione até 3 causas que melhor definam o trabalho da ONGs',
  },
  BENEFICIADOS: {
    id: 'BENEFICIADOS',
    defaultMessage: 'Número de beneficiados',
  },
  BENEFICIADOS_HINT: {
    id: 'BENEFICIADOS_HINT',
    defaultMessage: 'Estimativa do número de pessoas impactadas',
  },
})

class OrganizationComposerBasics extends React.Component<
  OrganizationComposerBasicsProps &
    InjectedFormikProps<
      OrganizationComposerBasicsProps & WithIntlProps<any>,
      Values
    >
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
      intl,
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
              {intl.formatMessage(COMO_SERA_VISTA)}
            </h4>
            <OrganizationComposerCard {...values} />
          </div>
        }
      >
        {mode !== FormComposerMode.EDIT && (
          <h4 className="tc-muted ts-small">{intl.formatMessage(ETAPA1)}</h4>
        )}
        <h1 className="tw-light mb-1">{intl.formatMessage(SUA_ONG)}</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          {intl.formatMessage(PREENCHA)}
        </p>

        <FormGroup
          labelFor="ong-input-name"
          label={intl.formatMessage(NOME)}
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
          label={intl.formatMessage(RESUMO)}
          error={touched.description ? errors.description : undefined}
          length={values.description.length}
          maxLength={160}
          className="mb-4"
          hint={intl.formatMessage(RESUMO_HINT)}
        >
          <Textarea
            id="ong-input-description"
            name="description"
            minRows={3}
            value={values.description}
            onChange={handleChange}
            onBlur={this.handleBlur}
            className="input input--size-3"
            placeholder={intl.formatMessage(RESUMO_PLACEHOLDER)}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-image"
          label={intl.formatMessage(IMAGEM)}
          error={
            touched.image
              ? errors.image && ((errors.image as any).payload || errors.image)
              : undefined
          }
          className="mb-4"
          hint={<>{intl.formatMessage(IMAGEM_HINT)}</>}
        >
          <InputImage
            hint={<>{intl.formatMessage(IMAGEM_HINT2)}</>}
            value={values.image}
            ratio={100}
            onChange={this.handleImageChange}
            onBlur={this.handleImageBlur}
          />
        </FormGroup>

        <FormGroup
          labelFor="ong-input-address"
          label={intl.formatMessage(ENDERECO)}
          error={touched.address ? (errors.address as string) : undefined}
          className="mb-3"
          hint={intl.formatMessage(ENDERECO_HINT)}
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
          className="input input--size-3 w-1/2 mb-3"
          placeholder={intl.formatMessage(COMPLEMENTO)}
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
          {intl.formatMessage(ENDERECO_PLACEHOLDER)}
        </label>

        <FormGroup
          labelFor="ong-input-causes"
          label={intl.formatMessage(CAUSAS)}
          error={
            touched.causes ? ((errors.causes as any) as string) : undefined
          }
          length={values.causes.length}
          className="mb-4"
          maxLength={3}
          hint={intl.formatMessage(CAUSAS_HINT)}
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
          label={intl.formatMessage(BENEFICIADOS)}
          className="mb-3"
          hint={intl.formatMessage(BENEFICIADOS_HINT)}
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
  })(withIntl(OrganizationComposerBasics)),
)
