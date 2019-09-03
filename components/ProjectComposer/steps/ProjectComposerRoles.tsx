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
import { channel } from '~/base/common/constants'

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
    border-color: ${channel.theme.color.primary[500]};
    box-shadow: 0 0 0 1px ${channel.theme.color.primary[500]};
  }
`

const RoleAdd = styled.button`
  border-color: #a3cbe2;
  height: 300px;
  background: #f2faff;
  color: #0366d6;
  width: 100%;
  cursor: pointer;

  &:hover,
  &:focus {
    border-color: ${channel.theme.color.primary[500]};
    box-shadow: 0 0 0 1px ${channel.theme.color.primary[500]};
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

const ProjectComposerRoles: React.FC<
  InjectedFormikProps<ProjectComposerDisponibilityProps, Values>
> = ({
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
      setFieldValue('roles', roles.filter((_, i) => i !== editingRoleIndex))
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
          <HelpCard className="card pr-4 pb-4 pl-4 pt-2 mb-3">
            <h4 className="ts-medium tw-medium">Visibilidade da vaga!</h4>
            <p className="tc-muted-dark mb-0">
              Precisa de diferentes voluntários para um mesmo projeto? Ao invés
              de criar múltiplas vagas, crie uma só com várias funções de
              voluntário. Isso facilita o compartilhamento e concentra as
              oportunidades.
            </p>
          </HelpCard>
          <HelpCard className="card pr-4 pb-4 pl-4 pt-2">
            <h4 className="ts-medium tw-medium">Exemplo:</h4>
            <p className="mb-1">
              <b>Nome da vaga:</b> Oficinas de dança
              <br />
              <b>Funções:</b> <br />
            </p>
            <div className="pl-1">
              1. Professor (a) de balé <br />
              2. Professor (a) de hip-hop <br />
              3. Professor (a) de Jazz <br />
              4. Professor (a) de Xaxado
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
        <h4 className="tc-muted ts-small">ETAPA 3</h4>
      )}
      <h1 className="tw-light mb-1">Funções do voluntário</h1>
      <p className="ts-medium tc-muted-dark mb-4">
        Insira as funções que o voluntário irá exercer nesta ação.
      </p>
      <div className="row">
        {values.roles.map((role, i) => (
          <div key={i} className="col-md-6 mb-3">
            <Role onClick={() => handleRoleEdit(role, i)}>
              <RoleCard className="card p-2">
                <RoleButtonWrapper>
                  <div className="btn btn-primary btn--strong btn--size-2 btn--block">
                    Editar
                  </div>
                </RoleButtonWrapper>
                <RoleName>{role.name}</RoleName>
                <h5 className="ts-small">Descrição</h5>
                <p className="ts-small mb-2">{role.details}</p>
                <h5 className="ts-small">Pré-requisitos</h5>
                <p className="ts-small mb-2">{role.prerequisites}</p>
                <h5 className="ts-small">Vagas</h5>
                <p className="ts-small mb-2">{role.vacancies}</p>
              </RoleCard>
            </Role>
          </div>
        ))}
        <div className="col-md-6 mb-3">
          <RoleAdd onClick={openModal}>
            <Icon name="add" />
            <br />
            <span>Adicionar função</span>
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
    label: 'Funções',
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
