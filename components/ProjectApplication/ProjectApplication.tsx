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
import { Page, Config } from '~/common'
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

const ProjectApplicationFormProps: React.FC<InjectedFormikProps<
  ProjectApplicationProps,
  Values
>> = ({
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
      className={`${className || ''} card no-border rounded-lg shadow-3xl p-5`}
    >
      <h4 className="font-normal">{intl.formatMessage(FORMULARIO)}</h4>
      <hr />

      {project.roles && project.roles.length > 0 && (
        <>
          <b className="block mb-2">{intl.formatMessage(FUNCAO)}</b>
          <div className="card mb-6">
            {project.roles.map(role => {
              const hasVacancies = role.applied_count < role.vacancies
              const disableRoleButton =
                Config.project.blockApplicationsAtLimit && !hasVacancies

              return (
                <div key={role.id} className="card-item">
                  <RoleButton
                    type="button"
                    disabled={disableRoleButton}
                    className={`p-3 media ${
                      disableRoleButton ? 'bg-gray-300 cursor-not-allowed' : ''
                    }`}
                    onClick={() => setFieldValue('roleId', role.id)}
                  >
                    <span
                      className={`input-radio mr-4 ${
                        values.roleId === role.id ? 'checked' : ''
                      } ${disableRoleButton ? 'cursor-not-allowed' : ''}`}
                    />
                    <div className="media-body flex flex-row justify-between">
                      <b className={disableRoleButton ? 'text-gray-600' : ''}>
                        {role.name}
                      </b>
                      {disableRoleButton && (
                        <div className="bg-red-600 text-white py-1 px-2 rounded-sm font-bold">
                          Sem vagas
                        </div>
                      )}
                    </div>
                  </RoleButton>
                  {values.roleId === role.id && (
                    <RoleBody className="bg-muted text-sm p-3">
                      <p>{role.details}</p>
                      <p className="mb-0">
                        <b>{intl.formatMessage(PRE_REQUISITOS)} </b>
                        {role.prerequisites}
                      </p>
                    </RoleBody>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
      <FormGroup
        labelFor="profile-input-message"
        label={intl.formatMessage(MENSAGEM)}
        error={touched.message ? errors.message : undefined}
        length={values.message.length}
        maxLength={150}
        className="mb-6"
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
        className="mb-6"
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
        className="btn btn--size-4 text-white bg-primary-500 hover:bg-primary-600 mb-4 btn--block"
        disabled={isSubmitting}
      >
        {intl.formatMessage(CONFIRMAR)}
        {isSubmitting && (
          <ActivityIndicator size={36} fill="white" className="ml-1" />
        )}
      </button>
      <p className="text-gray-600 text-sm">
        {intl.formatMessage(AO_CONFIRMAR)}
      </p>

      <div className="p-2 bg-gray-200 rounded-lg">
        <Icon name="info" />{' '}
        <b>
          <FormattedMessage
            id="projectApplicationForm.tip"
            defaultMessage="Não se esqueça de manter suas informações atualizadas"
          />
          !
        </b>{' '}
        <span className="block mb-4 text-sm text-gray-600">
          {intl.formatMessage(MANTENHA)}{' '}
        </span>
        <a
          href={Page.ViewerSettings}
          target="__blank"
          className="btn bg-gray-400 hover:bg-gray-500 text-gray-700 td-underline"
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
  terms: Yup.boolean().oneOf([true], () => ({
    code: 'terms',
    message: 'Você deve aceitar os termos de voluntariado',
    values: {},
  })),
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
      const role =
        project.roles && project.roles.find(r => r.id === values.roleId)

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
