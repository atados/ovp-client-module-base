import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import useTriggerableFetchApi from '~/hooks/use-trigglerable-fetch-api'
import { reportError } from '~/lib/utils/error'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { Post } from '~/types/api'
import ActivityIndicator from './ActivityIndicator'
import Icon from './Icon'

interface ClosePostFormProps {
  readonly className?: string
  readonly viewer: User
  readonly project: Project
  readonly post: Post
  readonly onFinish: () => void
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string },
  ) => any
}

const ClosePostForm: React.FC<ClosePostFormProps> = ({
  className,
  project,
  onFinish,
  onUpdateProject,
  post,
}) => {
  const { trigger, loading } = useTriggerableFetchApi(
    `/projects/${project.slug}/post/${post.id}/`,
    { method: 'DELETE' },
  )
  const onSubmit = useCallback(async () => {
    try {
      await trigger()
      onUpdateProject({
        posts: project.posts.filter(postItem => postItem.id !== post.id),
        slug: project.slug,
      })
    } catch (error) {
      reportError(error)
    }

    onFinish()
  }, [trigger, project])

  return (
    <div className={className}>
      <h4 className="tw-normal">
        Tem certeza que deseja remover essa publicação?
      </h4>

      <hr />
      <p>
        Ao remover uma publicação vaga você não poderá mais restaura-la, ela
        sairá da plataforma.
      </p>
      <div className="d-flex">
        <button
          type="button"
          onClick={onFinish}
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
          Remover publicação
          {loading && (
            <ActivityIndicator size={40} fill="#fff" className="ml-1" />
          )}
        </button>
      </div>
    </div>
  )
}

ClosePostForm.displayName = 'ClosePostForm'

export default connect(
  undefined,
  { onUpdateProject: updateProject },
)(ClosePostForm)
