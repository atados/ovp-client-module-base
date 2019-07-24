import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { PayloadAction } from 'redux-handy'
import styled from 'styled-components'
import ActivityIndicator from '~/components/ActivityIndicator'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { Project, ProjectRole } from '~/redux/ducks/project'
import {
  ApplicationPayload,
  applyToProject,
} from '~/redux/ducks/project-application'

const RoleButton = styled.button`
  width: 100%;
  background: none;
  border: 0;
  outline: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }
`

const RoleBody = styled.div`
  border-top: 1px solid #ccc;
`

export interface ProjectApplicationFormProps {
  readonly className?: string
  readonly roles: ProjectRole[]
  readonly roleId: number
  readonly project: Project
  readonly onSubmit: (payload: ApplicationPayload) => PayloadAction<boolean>
  readonly onFinish?: () => any
}

interface Values {
  readonly terms: boolean
  readonly roleId: number
  readonly message: string
}

const ProjectApplicationFormProps: React.FC<
  InjectedFormikProps<ProjectApplicationFormProps, Values>
> = ({
  className,
  touched,
  handleChange,
  handleBlur,
  errors,
  values,
  roles,
  isSubmitting,
  handleSubmit,
  setFieldValue,
}) => {
  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className={`${className || ''} card no-border radius-10 shadow-xl p-5`}
    >
      <h4 className="tw-normal">Formulário de inscrição</h4>
      <hr />

      {roles && roles.length > 0 && (
        <>
          <b className="d-block mb-2">Função</b>
          <div className="card mb-4">
            {roles.map(role => (
              <div key={role.id} className="card-item">
                <RoleButton
                  type="button"
                  className="p-3 media"
                  onClick={() => setFieldValue('roleId', role.id)}
                >
                  <span
                    className={`input-radio mr-3${
                      values.roleId === role.id ? ' checked' : ''
                    }`}
                  />
                  <div className="media-body">
                    <b>{role.name}</b>
                  </div>
                </RoleButton>
                {values.roleId === role.id && (
                  <RoleBody className="bg-muted ts-small p-3">
                    <p>{role.details}</p>
                    <p className="mb-0">
                      <b>Pré-requisitos: </b>
                      {role.prerequisites}
                    </p>
                  </RoleBody>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <FormGroup
        labelFor="profile-input-message"
        label="Mensagem"
        error={touched.message ? errors.message : undefined}
        length={values.message.length}
        maxLength={150}
        className="mb-4"
        required={false}
      >
        <Textarea
          id="profile-input-message"
          name="message"
          minRows={3}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input--size-3"
        />
      </FormGroup>
      <FormGroup
        error={touched.terms ? errors.terms : undefined}
        className="mb-4"
      >
        <input
          name="terms"
          type="checkbox"
          className="input mr-2"
          checked={values.terms}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span>
          Eu declaro que li e aceito os{' '}
          <a href="/termos/voluntariado" target="__blank">
            termos de voluntariado
          </a>
        </span>
      </FormGroup>
      <button
        type="submit"
        className="btn btn--size-3 btn-primary mb-3"
        disabled={isSubmitting}
      >
        Confirmar inscrição na vaga
        {isSubmitting && (
          <ActivityIndicator size={36} fill="white" className="ml-1" />
        )}
      </button>
      <p className="tc-muted ts-small">
        Ao confirmar a inscrição você se compromete a fazer parte dessa vaga
        como voluntário. A ONG será informada da sua inscrição e fará contato.
      </p>

      <div className="card p-2 bg-outline-primary">
        Mantenha suas informações de contato atualizadas para que o responsável
        pela vaga possa entrar em contato com você.{' '}
        <a
          href="/configuracoes/perfil"
          target="__blank"
          className="tc-base td-underline"
        >
          Atualizar minhas informações
        </a>
      </div>
    </form>
  )
}

ProjectApplicationFormProps.displayName = 'ProjectApplicationFormProps'

const ProjectApplicationFormSchema = Yup.object().shape({
  roleId: Yup.string().required(),
  terms: Yup.boolean().oneOf(
    [true],
    'Você deve aceitar os termos de voluntariado',
  ),
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (payload: ApplicationPayload) => dispatch(applyToProject(payload)),
})

export default connect(
  undefined,
  mapDispatchToProps,
)(
  withFormik<ProjectApplicationFormProps, Values>({
    displayName: 'ProjectApplicationFormProps',
    mapPropsToValues: ({ roleId, roles }: ProjectApplicationFormProps) => ({
      terms: false,
      roleId: roleId || (roles.length ? roles[0].id : -1),
      message: '',
    }),
    handleSubmit: async (
      values,
      { props: { project, roles, onSubmit, onFinish }, setSubmitting },
    ) => {
      const role = roles.find(r => r.id === values.roleId)

      const { payload: success } = await onSubmit({
        project,
        message: values.message,
        role,
      })
      setSubmitting(false)

      if (success && onFinish) {
        onFinish()
      }
    },
    validationSchema: ProjectApplicationFormSchema,
  })(ProjectApplicationFormProps),
)
