import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import { PayloadAction } from 'redux-handy'
import ActivityIndicator from '~/components/ActivityIndicator'
import { ProjectRole } from '~/redux/ducks/project'
import {
  UnapplicationPayload,
  unapplyFromProject,
} from '~/redux/ducks/project-application'
import { User } from '~/redux/ducks/user'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

export interface ProjectUnapplicationProps {
  readonly currentUser: User
  readonly onFinish: () => any
  readonly className?: string
  readonly roles: ProjectRole[]
  readonly roleId: number
  readonly projectSlug: string
  readonly onSubmit: (payload: UnapplicationPayload) => PayloadAction<boolean>
}

const { DESINSCREVER, CANCELAR, CONFIRMAR } = defineMessages({
  DESINSCREVER: {
    id: 'DESINSCREVER',
    defaultMessage: 'Tem certeza que deseja se desinscrever?',
  },
  CANCELAR: {
    id: 'CANCELAR',
    defaultMessage: 'Cancelar',
  },
  CONFIRMAR: {
    id: 'CONFIRMAR',
    defaultMessage: 'Confirmar desistência da vaga',
  },
})

// tslint:disable-next-line
type Values = {}

const ProjectUnapplicationProps: React.FC<
  InjectedFormikProps<ProjectUnapplicationProps, Values>
> = ({ className, onFinish, isSubmitting, handleSubmit }) => {
  const intl = useIntl()

  return (
    <form method="post" onSubmit={handleSubmit} className={className}>
      <h4 className="tw-normal ta-center">
        {intl.formatMessage(DESINSCREVER)}
      </h4>
      <hr />
      <div className="ta-center">
        <button
          type="button"
          className="btn btn--size-3 btn-default mr-2"
          onClick={onFinish}
        >
          {intl.formatMessage(CANCELAR)}
        </button>
        <button
          type="submit"
          className="btn btn--size-3 btn-error"
          disabled={isSubmitting}
        >
          {intl.formatMessage(CONFIRMAR)}
          {isSubmitting && (
            <ActivityIndicator size={36} fill="white" className="ml-1" />
          )}
        </button>
      </div>
    </form>
  )
}

ProjectUnapplicationProps.displayName = 'ProjectUnapplicationProps'

const mapStateToProps = ({ user: currentUser }) => ({
  currentUser,
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (payload: UnapplicationPayload) =>
    dispatch(unapplyFromProject(payload)),
})

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(
    withFormik<ProjectUnapplicationProps, Values>({
      displayName: 'ProjectUnapplicationProps',
      mapPropsToValues: () => ({}),
      handleSubmit: async (
        _,
        {
          props: { projectSlug, currentUser, onSubmit, onFinish },
          setSubmitting,
        },
      ) => {
        const { payload: success } = await onSubmit({
          projectSlug,
          currentUserSlug: currentUser.slug,
        })

        setSubmitting(false)

        if (success && onFinish) {
          onFinish()
        }
      },
    })(ProjectUnapplicationProps),
  ),
)
