import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import useTriggerableFetchApi from '~/hooks/use-trigglerable-fetch-api'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import ActivityIndicator from './ActivityIndicator'
import Icon from './Icon'

interface CloseProjectFormProps {
  readonly className?: string
  readonly viewer: User
  readonly projectSlug: string
  readonly onCancel: () => void
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
  const { trigger, loading } = useTriggerableFetchApi(
    `/projects/${projectSlug}/`,
  )
  const onSubmit = useCallback(async () => {
    await trigger()
    onUpdateProject({ closed: true, slug: projectSlug })
  }, [trigger])
  return (
    <div className={className}>
      <h4 className="tw-normal">Tem certeza que deseja encerrar essa vaga</h4>

      <hr />
      <p>
        Ao encerrar a vaga você não poderá mais reabri-la, ela sairá da listagem
        na plataforma e não poderá receber mais inscrições.
      </p>
      <div className="d-flex">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-muted btb--size-3"
          disabled={loading}
        >
          Cancelar
        </button>
        <div className="mr-auto" />
        <button
          type="button"
          onClick={onSubmit}
          className="btn btn-error btb--size-3 mr-2"
          disabled={loading}
        >
          <Icon name="close" className="mr-2" />
          Encerrar essa vaga
          {loading && (
            <ActivityIndicator size={40} fill="#fff" className="ml-1" />
          )}
        </button>
      </div>
    </div>
  )
}

CloseProjectForm.displayName = 'CloseProjectForm'

export default connect(
  undefined,
  { onUpdateProject: updateProject },
)(CloseProjectForm)
