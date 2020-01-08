import { InjectedFormikProps, withFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import HelpCard from '~/components/HelpCard'
import Icon from '~/components/Icon'
import Modal, { ModalCard } from '~/components/Modal'
import asFormStep, {
  InjectedMultipleStepsFormProps,
} from '~/components/MultipleStepsForm/as-form-step'
import Yup from '~/lib/form/yup'
import { Project, ProjectRole } from '~/redux/ducks/project'
import RoleForm from '../components/RoleForm'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import { Color } from '~/base/common'

const Role = styled.button`
  background: none;
  border: 0;
  height: 300px;
  width: 100%;
  padding: 0;
`

const RoleCard = styled.div`
  height: 100%;
  overflow: hidden;
  text-align: left;
  background: none;
  cursor: pointer;
  position: relative;
  width: 100%;
  vertical-align: top;

  &:hover,
  &:focus {
    border-color: ${Color.primary[500]};
    box-shadow: 0 0 0 1px ${Color.primary[500]};
  }
`

const RoleAdd = styled.button`
  border: 1px solid #a3cbe2;
  height: 300px;
  background: #f2faff;
  color: #0366d6;
  width: 100%;
  cursor: pointer;

  &:hover,
  &:focus {
    border-color: ${Color.primary[500]};
    box-shadow: 0 0 0 1px ${Color.primary[500]};
  }

  > .icon {
    font-size: 48px;
  }
`

const RoleButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 10px;
  box-shadow: 0 -1px rgba(0, 0, 0, 0.15);
`

const RoleName = styled.h2`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
`

const {
  VISIBILIDADE,
  PRECISA,
  NOME_VAGA,
  OFICINAS_DANCA,
  FUNCOES,
  FUNCAO1,
  FUNCAO2,
  FUNCAO3,
  FUNCAO4,
  EXEMPLO,
  ETAPA3,
  FUNCOES_VOLUNTARIO,
  INSIRA_FUNCOES,
  EDITAR,
  DESCRICAO,
  PRE_REQUISITOS,
  VAGAS,
  ADICIONAR_FUNCAO,
} = defineMessages({
  VISIBILIDADE: {
    id: 'VISIBILIDADE',
    defaultMessage: 'Visibilidade da vaga!',
  },
  PRECISA: {
    id: 'PRECISA',
    defaultMessage:
      'Precisa de diferentes voluntários para um mesmo projeto? Ao invés de criar múltiplas vagas, crie uma só com várias funções de voluntário.Isso facilita o compartilhamento e concentra as oportunidades.',
  },
  NOME_VAGA: {
    id: 'NOME_VAGA',
    defaultMessage: 'Nome da vaga:',
  },
  OFICINAS_DANCA: {
    id: 'OFICINAS_DANCA',
    defaultMessage: 'Oficinas de dança',
  },
  FUNCOES: {
    id: 'FUNCOES',
    defaultMessage: 'Funções:',
  },
  FUNCAO1: {
    id: 'FUNCAO1',
    defaultMessage: '1. Professor (a) de balé',
  },
  FUNCAO2: {
    id: 'FUNCAO2',
    defaultMessage: '2. Professor (a) de hip-hop',
  },
  FUNCAO3: {
    id: 'FUNCAO3',
    defaultMessage: '3. Professor (a) de Jazz',
  },
  FUNCAO4: {
    id: 'FUNCAO4',
    defaultMessage: '4. Professor (a) de Xaxado',
  },
  EXEMPLO: {
    id: 'EXEMPLO',
    defaultMessage: 'Exemplo:',
  },
  ETAPA3: {
    id: 'ETAPA3',
    defaultMessage: 'ETAPA 3',
  },
  FUNCOES_VOLUNTARIO: {
    id: 'FUNCOES_VOLUNTARIO',
    defaultMessage: 'Funções do voluntário',
  },
  INSIRA_FUNCOES: {
    id: 'INSIRA_FUNCOES',
    defaultMessage:
      'Insira as funções que o voluntário irá exercer nesta ação.',
  },
  EDITAR: {
    id: 'projectComposerRoles.edit',
    defaultMessage: 'Editar',
  },
  DESCRICAO: {
    id: 'DESCRICAO',
    defaultMessage: 'Descrição',
  },
  PRE_REQUISITOS: {
    id: 'PRE_REQUISITOS',
    defaultMessage: 'Pré-requisitos',
  },
  VAGAS: {
    id: 'VAGAS',
    defaultMessage: 'Vagas',
  },
  ADICIONAR_FUNCAO: {
    id: 'ADICIONAR_FUNCAO',
    defaultMessage: 'Adicionar função',
  },
})

const ProjectComposerRolesSchema = Yup.object().shape({
  roles: Yup.array()
    .min(1)
    .required(),
})

type ItemRole = Pick<
  ProjectRole,
  'details' | 'name' | 'prerequisites' | 'vacancies'
>

export interface Values {
  readonly roles: ItemRole[]
}

interface ProjectComposerDisponibilityProps
  extends InjectedMultipleStepsFormProps<any, any, any> {
  readonly className?: string
}

interface ProjectComposerDisponibilityState {
  editingRole?: ItemRole
  editingRoleIndex?: number
  modalOpen: boolean
}

const ProjectComposerRoles: React.FC<InjectedFormikProps<
  ProjectComposerDisponibilityProps,
  Values
>> = ({
  className,
  isValid,
  values,
  handleSubmit,
  setFieldValue,
  isFormSubmitting,
  formContext: { mode },
}) => {
  const [state, setState] = useState<ProjectComposerDisponibilityState>({
    modalOpen: false,
  })
  const intl = useIntl()
  const handleFormSubmit = useCallback(
    (role: ItemRole) => {
      const { roles } = values
      const { editingRoleIndex } = state

      if (editingRoleIndex !== undefined && editingRoleIndex > -1) {
        setFieldValue(
          'roles',
          roles.map((itemRole, i) => {
            if (i === editingRoleIndex) {
              return role
            }

            return itemRole
          }),
        )
      } else {
        setFieldValue('roles', [...roles, role])
      }

      // saveDraft()

      setState({ modalOpen: false })
    },
    [state.editingRoleIndex, values, setFieldValue],
  )
  const handleFormRemove = useCallback(() => {
    const { roles } = values
    const { editingRoleIndex } = state

    if (editingRoleIndex !== undefined && editingRoleIndex > -1) {
      setFieldValue(
        'roles',
        roles.filter((_, i) => i !== editingRoleIndex),
      )
    }

    setState({ modalOpen: false })
  }, [state.editingRoleIndex, values, setFieldValue])
  const openModal = useCallback(() => {
    setState({ modalOpen: true })
  }, [])
  const handleRoleEdit = useCallback((role: ItemRole, index: number) => {
    setState({
      editingRole: role,
      editingRoleIndex: index,
      modalOpen: true,
    })
  }, [])
  const handleClose = () => setState({ modalOpen: false })

  return (
    <FormComposerLayout
      disabled={!isValid}
      onSubmit={handleSubmit}
      className={className}
      isSubmitting={isFormSubmitting}
      helpPanelChildren={
        <div className="p-5">
          <HelpCard className="card pr-5 pb-5 pl-5 pt-3 mb-4">
            <h4 className="text-lg font-medium">
              {intl.formatMessage(VISIBILIDADE)}
            </h4>
            <p className="text-gray-700 mb-0">{intl.formatMessage(PRECISA)}</p>
          </HelpCard>
          <HelpCard className="card pr-5 pb-5 pl-5 pt-3">
            <h4 className="text-lg font-medium">
              {intl.formatMessage(EXEMPLO)}
            </h4>
            <p className="mb-1">
              <b>{intl.formatMessage(NOME_VAGA)}</b>
              {` ${intl.formatMessage(OFICINAS_DANCA)} `}
              <br />
              <b>{intl.formatMessage(FUNCOES)}</b> <br />
            </p>
            <div className="pl-2">
              {intl.formatMessage(FUNCAO1)} <br />
              {intl.formatMessage(FUNCAO2)} <br />
              {intl.formatMessage(FUNCAO3)} <br />
              {intl.formatMessage(FUNCAO4)}
            </div>
          </HelpCard>
        </div>
      }
      noForm
    >
      <Modal
        key={state.editingRoleIndex}
        open={state.modalOpen}
        onClose={handleClose}
      >
        <ModalCard className="p-5">
          <RoleForm
            key={values.roles.length}
            defaultValue={state.editingRole}
            onSubmit={handleFormSubmit}
            onRemove={handleFormRemove}
          />
        </ModalCard>
      </Modal>
      {mode !== FormComposerMode.EDIT && (
        <h4 className="text-gray-600 text-sm">{intl.formatMessage(ETAPA3)}</h4>
      )}
      <h1 className="font-light mb-1">
        {intl.formatMessage(FUNCOES_VOLUNTARIO)}
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        {intl.formatMessage(INSIRA_FUNCOES)}
      </p>
      <div className="flex flex-wrap px-2 -mx-2">
        {values.roles.map((role, i) => (
          <div key={i} className="w-full md:w-1/2 px-2 mb-4">
            <Role onClick={() => handleRoleEdit(role, i)}>
              <RoleCard className="card p-2">
                <RoleButtonWrapper>
                  <div className="btn btn-primary btn--strong btn--size-2 btn--block">
                    {intl.formatMessage(EDITAR)}
                  </div>
                </RoleButtonWrapper>
                <RoleName>{role.name}</RoleName>
                <h5 className="text-sm">{intl.formatMessage(DESCRICAO)}</h5>
                <p className="text-sm mb-2">{role.details}</p>
                <h5 className="text-sm">
                  {intl.formatMessage(PRE_REQUISITOS)}
                </h5>
                <p className="text-sm mb-2">{role.prerequisites}</p>
                <h5 className="text-sm">{intl.formatMessage(VAGAS)}</h5>
                <p className="text-sm mb-2">{role.vacancies}</p>
              </RoleCard>
            </Role>
          </div>
        ))}
        <div className="w-full md:w-1/2 mb-4">
          <RoleAdd onClick={openModal}>
            <Icon name="add" />
            <br />
            <span>{intl.formatMessage(ADICIONAR_FUNCAO)}</span>
          </RoleAdd>
        </div>
      </div>
    </FormComposerLayout>
  )
}

ProjectComposerRoles.displayName = 'ProjectComposerRoles'

export default asFormStep(
  'funcoes',
  {
    label: () => (
      <FormattedMessage
        id="projectComposerRoles.stepTitle"
        defaultMessage="Funções"
      />
    ),
    isDone: (value: Partial<Project>) =>
      ProjectComposerRolesSchema.isValidSync(value),
  },
  withFormik<ProjectComposerDisponibilityProps, Values>({
    displayName: 'ProjectComposerDisponibilityForm',
    handleSubmit: (values, { props: { onSubmit } }) => {
      onSubmit(project => ({
        ...project,
        roles: values.roles,
      }))
    },
    isInitialValid: ({ value }: ProjectComposerDisponibilityProps) =>
      value ? ProjectComposerRolesSchema.isValidSync(value) : false,
    validationSchema: ProjectComposerRolesSchema,
    mapPropsToValues: ({ value }) => ({
      roles: (value && value.roles) || [],
    }),
  })(ProjectComposerRoles),
)
