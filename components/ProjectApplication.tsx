import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import ActivityIndicator from '~/components/ActivityIndicator'
import FormGroup from '~/components/Form/FormGroup'
import Yup from '~/lib/form/yup'
import { Project } from '~/redux/ducks/project'
import {
  ApplicationPayload,
  applyToProject,
} from '~/redux/ducks/project-application'
import { Page } from '~/base/common'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import Icon from '~/components/Icon'
import { FormattedMessage } from 'react-intl'

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

export interface ProjectApplicationProps {
  readonly className?: string
  readonly defaultRoleId?: number
  readonly project: Project
  readonly next?: () => any
}

interface Values {
  readonly terms: boolean
  readonly roleId: number
  readonly message: string
}

const {
  FORMULARIO,
  FUNCAO,
  PRE_REQUISITOS,
  MENSAGEM,
  DECLARO,
  TERMOS,
  CONFIRMAR,
  AO_CONFIRMAR,
  MANTENHA,
  ATUALIZAR,
} = defineMessages({
  FORMULARIO: {
    id: 'FORMULARIO',
    defaultMessage: 'Formulário de inscrição',
  },
  FUNCAO: {
    id: 'FUNCAO',
    defaultMessage: 'Função',
  },
  PRE_REQUISITOS: {
    id: 'PRE_REQUISITOS',
    defaultMessage: 'Pré-requisitos:',
  },
  MENSAGEM: {
    id: 'MENSAGEM',
    defaultMessage: 'Mensagem',
  },
  DECLARO: {
    id: 'DECLARO',
    defaultMessage: 'Eu declaro que li e aceito os',
  },
  TERMOS: {
    id: 'TERMOS',
    defaultMessage: 'termos de voluntariado',
  },
  CONFIRMAR: {
    id: 'CONFIRMAR',
    defaultMessage: 'Confirmar inscrição na vaga',
  },
  AO_CONFIRMAR: {
    id: 'AO_CONFIRMAR',
    defaultMessage:
      'Ao confirmar a inscrição você se compromete a fazer parte dessa vaga como voluntário. A ONG será informada da sua inscrição e fará contato.',
  },
  MANTENHA: {
    id: 'MANTENHA',
    defaultMessage:
      'Mantenha suas informações de contato atualizadas para que o responsável pela vaga possa entrar em contato com você.',
  },
  ATUALIZAR: {
    id: 'ATUALIZAR',
    defaultMessage: 'Atualizar minhas informações',
  },
})

const ProjectApplicationFormProps: React.FC<
  InjectedFormikProps<ProjectApplicationProps, Values>
> = ({
  className,
  touched,
  handleChange,
  handleBlur,
  errors,
  values,
  isSubmitting,
  handleSubmit,
  setFieldValue,
  project,
}) => {
  const intl = useIntl()

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className={`${className || ''} card no-border radius-10 shadow-xl p-5`}
    >
      <h4 className="tw-normal">{intl.formatMessage(FORMULARIO)}</h4>
      <hr />

      {project.roles && project.roles.length > 0 && (
        <>
          <b className="block mb-2">{intl.formatMessage(FUNCAO)}</b>
          <div className="card mb-4">
            {project.roles.map(role => (
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
                      <b>{intl.formatMessage(PRE_REQUISITOS)} </b>
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
        label={intl.formatMessage(MENSAGEM)}
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
          {`${intl.formatMessage(DECLARO)} `}
          <a href="/termos/voluntariado" target="__blank">
            {intl.formatMessage(TERMOS)}
          </a>
        </span>
      </FormGroup>
      <button
        type="submit"
        className="btn btn--size-4 btn-primary mb-3 btn--block"
        disabled={isSubmitting}
      >
        {intl.formatMessage(CONFIRMAR)}
        {isSubmitting && (
          <ActivityIndicator size={36} fill="white" className="ml-1" />
        )}
      </button>
      <p className="tc-muted ts-small">{intl.formatMessage(AO_CONFIRMAR)}</p>

      <div className="p-2 bg-gray-200 rounded-lg">
        <Icon name="info" />{' '}
        <b>
          <FormattedMessage
            id="projectApplicationForm.tip"
            defaultMessage="Não se esqueça de manter suas informações atualizadas"
          />
          !
        </b>{' '}
        <span className="block mb-3 ts-small tc-gray-600">
          {intl.formatMessage(MANTENHA)}{' '}
        </span>
        <a
          href={Page.ViewerSettings}
          target="__blank"
          className="btn bg-gray-400 hover:bg-gray-500 tc-gray-700 td-underline"
        >
          <Icon name="edit" className="mr-2" />
          {intl.formatMessage(ATUALIZAR)}
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
  withFormik<
    ProjectApplicationProps & ReturnType<typeof mapDispatchToProps>,
    Values
  >({
    displayName: 'ProjectApplication',
    mapPropsToValues: ({
      defaultRoleId,
      project,
    }: ProjectApplicationProps) => ({
      terms: false,
      roleId:
        defaultRoleId ||
        (project.roles && project.roles.length ? project.roles[0].id : -1),
      message: '',
    }),
    handleSubmit: async (
      values,
      { props: { project, onSubmit, next }, setSubmitting },
    ) => {
      const role = project.roles.find(r => r.id === values.roleId)

      const { payload: success } = await onSubmit({
        project,
        message: values.message,
        role,
      })
      setSubmitting(false)

      if (success && next) {
        next()
      }
    },
    validationSchema: ProjectApplicationFormSchema,
  })(ProjectApplicationFormProps),
)
