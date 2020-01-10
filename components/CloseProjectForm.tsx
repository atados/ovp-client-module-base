import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import ActivityIndicator from './ActivityIndicator'
import Icon from './Icon'
import { FormattedMessage } from 'react-intl'
import { pushToDataLayer } from '../lib/tag-manager'

interface CloseProjectFormProps {
  readonly className?: string
  readonly viewer: User
  readonly projectSlug: string
  readonly onCancel?: () => void
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string },
  ) => any
}

const CloseProjectForm: React.FC<CloseProjectFormProps> = ({
  className,
  projectSlug,
  onCancel,
  onUpdateProject,
}) => {
  const { mutate, loading } = useFetchAPIMutation(() => ({
    endpoint: `/projects/${projectSlug}/close/`,
    method: 'POST',
  }))
  const onSubmit = useCallback(async () => {
    await mutate()
    pushToDataLayer({
      event: 'project.close',
      slug: projectSlug,
    })
    onUpdateProject({ closed: true, slug: projectSlug })

    if (onCancel) {
      onCancel()
    }
  }, [mutate])
  return (
    <div className={className}>
      <h4 className="font-normal">
        <FormattedMessage
          id="closeProjectForm.title"
          defaultMessage="Tem certeza que deseja encerrar essa vaga"
        />
      </h4>

      <hr />
      <p>
        <FormattedMessage
          id="closeProjectForm.subtitle"
          defaultMessage="Ao encerrar a vaga você não poderá mais reabri-la, ela sairá da listagem
          na plataforma e não poderá receber mais inscrições."
        />
      </p>
      <div className="flex">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-muted btb--size-3"
          disabled={loading}
        >
          <FormattedMessage
            id="closeProjectForm.cancel"
            defaultMessage="Cancelar"
          />
        </button>
        <div className="mr-auto" />
        <button
          type="button"
          onClick={onSubmit}
          className="btn btn-error btb--size-3 mr-2"
          disabled={loading}
        >
          <Icon name="close" className="mr-2" />
          <FormattedMessage
            id="closeProjectForm.submit"
            defaultMessage="Encerrar essa vaga"
          />
          {loading && (
            <ActivityIndicator size={40} fill="#fff" className="ml-1" />
          )}
        </button>
      </div>
    </div>
  )
}

CloseProjectForm.displayName = 'CloseProjectForm'

export default connect(undefined, { onUpdateProject: updateProject })(
  CloseProjectForm,
)
