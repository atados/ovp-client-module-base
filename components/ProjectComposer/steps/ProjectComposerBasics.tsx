import { InjectedFormikProps, withFormik } from "formik";
import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import MaskedTextInput from "react-text-mask";
import Textarea from "react-textarea-autosize";
import { DropdownDirection } from "~/components/Dropdown/Dropdown";
import FormGroup from "~/components/Form/FormGroup";
import { FormComposerMode } from "~/components/FormComposer/FormComposer";
import FormComposerLayout from "~/components/FormComposer/MultistepFormComposerLayout";
import InputAddress from "~/components/InputAddress";
import {
  AddressKind,
  InputAddressValueType
} from "~/components/InputAddress/InputAddress";
import InputImage, {
  InputImageValueType
} from "~/components/InputImage/InputImage";
import InputSelect, {
  InputSelectItem
} from "~/components/InputSelect/InputSelect";
import asFormStep, {
  InjectedMultipleStepsFormProps
} from "~/components/MultipleStepsForm/as-form-step";
import ProjectComposerCard from "~/components/ProjectComposer/components/ProjectComposerCard";
import useFetchAPI from "~/hooks/use-fetch-api";
import * as masks from "~/lib/form/masks";
import Yup from "~/lib/form/yup";
import { causeToSelectItem, skillToSelectItem } from "~/lib/utils/form";
import { hasQuerySucceeded } from "~/lib/utils/graphql";
import { Project } from "~/redux/ducks/project";
import { User } from "~/redux/ducks/user";
import { OrganizationMember } from "~/types/api";
import { defineMessages } from "react-intl";
import useIntl from "~/hooks/use-intl";

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
      fetching: Yup.boolean().notOneOf([false])
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
    .required()
});

export interface Values {
  readonly name: string;
  readonly benefitedPeople: string;
  readonly description: string;
  readonly image?: InputImageValueType;
  readonly address?: InputAddressValueType;
  readonly addressComplement: string;
  readonly causes: InputSelectItem[];
  readonly skills: InputSelectItem[];
  readonly owner_id: string;
}

interface ProjectComposerBasicsProps
  extends InjectedMultipleStepsFormProps<any, any, any> {
  readonly className?: string;
  readonly currentUser: User;
  readonly causesSelectItems: InputSelectItem[];
  readonly skillsSelectItems: InputSelectItem[];
}

const {
  COMO_VAI,
  ETAPA1,
  INFO,
  PREENCHA_INFO,
  NOME_VAGA,
  NOME_VAGA_HINT,
  DESCARTE_LATAS,
  RESUMO,
  RESUMO_HINT,
  EX_RESUMO,
  IMAGEM,
  IMAGEM_HINT,
  IMAGEM_HINT2,
  ENDERECO,
  ENDERECO_HINT,
  CAUSAS,
  CAUSAS_HINT,
  HABILIDADES,
  HABILIDADES_HINT,
  N_BENEFICIADOS,
  N_BENEFICIADOS_HINT,
  RESPONSIBLE,
  RESPONSIBLE_HINT,
  SELECIONE_MEMBRO
} = defineMessages({
  COMO_VAI: {
    id: "COMO_VAI",
    defaultMessage: "COMO SUA VAGA VAI SER VISTA:"
  },
  ETAPA1: {
    id: "ETAPA1",
    defaultMessage: "ETAPA 1"
  },
  INFO: {
    id: "INFO",
    defaultMessage: "Informações gerais"
  },
  PREENCHA_INFO: {
    id: "PREENCHA_INFO",
    defaultMessage: "Preencha as informações"
  },
  NOME_VAGA: {
    id: "NOME_VAGA",
    defaultMessage: "Nome da vaga"
  },
  NOME_VAGA_HINT: {
    id: "NOME_VAGA_HINT",
    defaultMessage:
      "Coloque um nome atrativo, algo que chame a atenção dos voluntários."
  },
  DESCARTE_LATAS: {
    id: "DESCARTE_LATAS",
    defaultMessage: "Ex.: Descarte latas #Cestou"
  },
  RESUMO: {
    id: "RESUMO",
    defaultMessage: "Resumo"
  },
  RESUMO_HINT: {
    id: "RESUMO_HINT",
    defaultMessage:
      "Faça uma chamada atrativa e resumida do trabalho. Seja convidativo (a), pois essa será a 1ª impressão que o voluntário terá da vaga."
  },
  EX_RESUMO: {
    id: "EX_RESUMO",
    defaultMessage:
      "Ex.: Dia 09/04 faremos instalação de cestas para o descarte exclusivo de latas, facilitando a coleta pelos catadores. Faça parte dessa intervenção urbana e coletiva."
  },
  IMAGEM: {
    id: "IMAGEM",
    defaultMessage: "Imagem"
  },
  IMAGEM_HINT: {
    id: "IMAGEM_HINT",
    defaultMessage:
      "Assim como o nome, a imagem deve ser bem atrativa e relacionada com a vaga!"
  },
  IMAGEM_HINT2: {
    id: "IMAGEM_HINT2",
    defaultMessage:
      "Carregue uma imagem no formato JPG, JPEG, PNG ou GIF de no máximo 2MB."
  },
  ENDERECO: {
    id: "ENDERECO",
    defaultMessage: "Endereço"
  },
  ENDERECO_HINT: {
    id: "ENDERECO_HINT",
    defaultMessage: "Comece a escrever e selecione uma opção"
  },
  CAUSAS: {
    id: "CAUSAS",
    defaultMessage: "Causas"
  },
  CAUSAS_HINT: {
    id: "CAUSAS_HINT",
    defaultMessage: "Selecione até 3 causas que melhor definem a vaga"
  },
  HABILIDADES: {
    id: "HABILIDADES",
    defaultMessage: "Habilidades possíveis para a vaga"
  },
  HABILIDADES_HINT: {
    id: "HABILIDADES_HINT",
    defaultMessage: "Selecione uma ou mais habilidades para o voluntário"
  },
  N_BENEFICIADOS: {
    id: "N_BENEFICIADOS",
    defaultMessage: "Número de beneficiados"
  },
  N_BENEFICIADOS_HINT: {
    id: "N_BENEFICIADOS_HINT",
    defaultMessage: "Estimativa do número de pessoas impactadas"
  },
  RESPONSIBLE: {
    id: "RESPONSIBLE",
    defaultMessage: "Responsável da vaga"
  },
  RESPONSIBLE_HINT: {
    id: "RESPONSIBLE_HINT",
    defaultMessage:
      "Selecione a pessoa que será responsável pela coordanação dos voluntários. Ela ficará responsável por respondê-los."
  },
  SELECIONE_MEMBRO: {
    id: "SELECIONE_MEMBRO",
    defaultMessage: "Selecione um membro da ONG"
  }
});

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
  formContext: { organization, mode }
}) => {
  const handleBlur = useCallback(() => {
    setFieldTouched("causes");
  }, [setFieldTouched]);
  const handleAddressBlur = useCallback(() => {
    setFieldTouched("address");
  }, [setFieldTouched]);
  const handleImageBlur = useCallback(() => {
    setFieldTouched("image");
  }, [setFieldTouched]);
  const handleCausesBlur = useCallback(() => {
    setFieldTouched("causes");
  }, [setFieldTouched]);
  const handleSkillsBlur = useCallback(() => {
    setFieldTouched("skills");
  }, [setFieldTouched]);
  const intl = useIntl();

  const handleImageChange = useCallback(
    newValue => {
      setFieldValue("image", newValue);
    },
    [setFieldValue]
  );
  const handleAddressChange = useCallback(
    newValue => {
      setFieldValue("address", newValue);
    },
    [setFieldValue]
  );
  const handleCausesChange = useCallback(
    newValue => {
      setFieldValue("causes", newValue);
    },
    [setFieldValue]
  );
  const handleSkillsChange = useCallback(
    newValue => {
      setFieldValue("skills", newValue);
    },
    [setFieldValue]
  );
  const queryMembers = useFetchAPI<OrganizationMember[]>(
    `/organizations/${organization ? organization.slug : ""}/members/`,
    {
      skip: !organization
    }
  );

  const members: OrganizationMember[] = useMemo(() => {
    return (hasQuerySucceeded(queryMembers) && queryMembers.data!) || [];
  }, [queryMembers]);

  return (
    <FormComposerLayout
      onSubmit={handleSubmit}
      isSubmitting={isFormSubmitting}
      disabled={!isValid}
      helpPanelChildren={
        <div className="px-3 py-5">
          <span className="tc-muted tw-medium ts-small mb-3 block ta-center">
            {intl.formatMessage(COMO_VAI)}
          </span>
          <ProjectComposerCard values={values} className="mx-auto" />
        </div>
      }
    >
      {mode !== FormComposerMode.EDIT && (
        <h4 className="tc-muted ts-small">{intl.formatMessage(ETAPA1)}</h4>
      )}
      <h1 className="tw-light mb-1">{intl.formatMessage(INFO)}</h1>
      <p className="ts-medium tc-muted-dark mb-4">
        {intl.formatMessage(PREENCHA_INFO)}
      </p>

      <FormGroup
        labelFor="project-input-name"
        label={intl.formatMessage(NOME_VAGA)}
        error={touched.name ? errors.name : undefined}
        length={values.name.length}
        maxLength={150}
        className="mb-4"
        hint={intl.formatMessage(NOME_VAGA_HINT)}
      >
        <input
          id="project-input-name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          className="input input--size-4"
          placeholder={intl.formatMessage(DESCARTE_LATAS)}
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-description"
        label={intl.formatMessage(RESUMO)}
        error={touched.description ? errors.description : undefined}
        length={values.description.length}
        maxLength={160}
        className="mb-4"
        hint={intl.formatMessage(RESUMO_HINT)}
      >
        <Textarea
          id="project-input-description"
          name="description"
          minRows={3}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={intl.formatMessage(EX_RESUMO)}
          className="input input--size-4"
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-image"
        label={intl.formatMessage(IMAGEM)}
        error={
          touched.image
            ? errors.image && ((errors.image as any).payload || errors.image)
            : undefined
        }
        className="mb-4"
        hint={intl.formatMessage(IMAGEM_HINT)}
      >
        <InputImage
          hint={<>{intl.formatMessage(IMAGEM_HINT2)}</>}
          value={values.image}
          ratio={66.666666666}
          onChange={handleImageChange}
          onBlur={handleImageBlur}
        />
      </FormGroup>

      <FormGroup
        labelFor="project-input-address"
        label={intl.formatMessage(ENDERECO)}
        error={touched.address ? (errors.address as string) : undefined}
        className="mb-3"
        hint={intl.formatMessage(ENDERECO_HINT)}
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
        className="input input--size-4 w-1/2 mb-3"
        placeholder="Complemento"
        value={values.addressComplement}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormGroup
        labelFor="project-input-causes"
        label={intl.formatMessage(CAUSAS)}
        error={touched.causes ? ((errors.causes as any) as string) : undefined}
        length={values.causes.length}
        className="mb-4"
        maxLength={3}
        hint={intl.formatMessage(CAUSAS_HINT)}
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
        label={intl.formatMessage(HABILIDADES)}
        error={touched.skills ? ((errors.skills as any) as string) : undefined}
        length={values.skills.length}
        className="mb-4"
        maxLength={3}
        hint={intl.formatMessage(HABILIDADES_HINT)}
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
        label={intl.formatMessage(N_BENEFICIADOS)}
        error={
          touched.benefitedPeople
            ? (errors.benefitedPeople as string)
            : undefined
        }
        className="mb-3"
        hint={intl.formatMessage(N_BENEFICIADOS_HINT)}
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
          label={intl.formatMessage(RESPONSIBLE)}
          error={touched.owner_id ? errors.owner_id : undefined}
          className="mb-4"
          hint={intl.formatMessage(RESPONSIBLE_HINT)}
        >
          <select
            id="project-input-owner_id"
            name="owner_id"
            value={values.owner_id}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input input--size-4"
          >
            <option value="">{intl.formatMessage(SELECIONE_MEMBRO)}</option>
            {members.map(member => (
              <option key={member.uuid} value={member.uuid}>
                {member.name}{" "}
                {currentUser.slug === member.slug ? " (Você)" : ""}
              </option>
            ))}
          </select>
        </FormGroup>
      )}
    </FormComposerLayout>
  );
};

ProjectComposerBasics.displayName = "ProjectComposerBasics";

const mapStateToProps = ({ user, startup }) => {
  return {
    currentUser: user!,
    causesSelectItems: startup.causes.map(causeToSelectItem),
    skillsSelectItems: startup.skills.map(skillToSelectItem)
  };
};

const mapPropsToValues = ({
  formContext: { organization },
  currentUser,
  value = {}
}: ProjectComposerBasicsProps): Values => ({
  name: value.name || "",
  description: value.description || "",
  addressComplement: (value.address && value.address.typed_address2) || "",
  causes: value.causes ? value.causes.map(causeToSelectItem) : [],
  skills: value.skills ? value.skills.map(skillToSelectItem) : [],
  address: value.address
    ? {
        kind: AddressKind.WEAK,
        node: { description: value.address.typed_address }
      }
    : null,
  image: value.image
    ? { previewURI: value.image.image_url, payload: value.image }
    : null,
  owner_id: value.owner
    ? value.owner.uuid
    : value.owner_id ||
      (organization ? "" : currentUser ? currentUser.uuid : ""),
  benefitedPeople: value.benefited_people
});

export default asFormStep(
  "geral",
  {
    label: "Informações Gerais",
    isDone: (value: Partial<Project>) =>
      ProjectBasicsFormSchema.isValidSync(
        mapPropsToValues({ formContext: {}, value } as any)
      )
  },
  connect(mapStateToProps)(
    withFormik<ProjectComposerBasicsProps, Values>({
      displayName: "ProjectComposerBasicsForm",
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
            typed_address2: values.addressComplement
          },
          causes: values.causes.map(item => ({
            id: item.value,
            name: item.label
          })),
          skills: values.skills.map(item => ({
            id: item.value,
            name: item.label
          })),
          image_id:
            values.image && values.image.payload && values.image.payload.id,
          image: values.image && values.image.payload,
          owner_id: values.owner_id,
          benefited_people: parseInt(values.benefitedPeople, 10)
        }));
      },
      isInitialValid: (props: ProjectComposerBasicsProps) =>
        props.value
          ? ProjectBasicsFormSchema.isValidSync(mapPropsToValues(props))
          : false,
      validationSchema: ProjectBasicsFormSchema,
      mapPropsToValues
    })(ProjectComposerBasics)
  )
);
