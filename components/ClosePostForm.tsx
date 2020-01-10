import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import { reportError } from '~/lib/utils/error'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { API } from '~/types/api'
import ActivityIndicator from './ActivityIndicator'
import Icon from './Icon'

export interface ClosePostFormProps {
  readonly className?: string
  readonly viewer: User
  readonly project: Project
  readonly post: API.Post
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
  const { mutate, loading } = useFetchAPIMutation(() => ({
    endpoint: `/projects/${project.slug}/post/${post.id}/`,
    method: 'DELETE',
  }))
  const onSubmit = useCallback(async () => {
    try {
      await mutate()
      onUpdateProject({
        posts: project.posts.filter(postItem => postItem.id !== post.id),
        slug: project.slug,
      })
    } catch (error) {
      reportError(error)
    }

    onFinish()
  }, [mutate, project])

  return (
    <div className={className}>
      <h4 className="font-normal">
        Tem certeza que deseja remover essa publicação?
      </h4>

      <hr />
      <p>
        Ao remover uma publicação vaga você não poderá mais restaura-la, ela
        sairá da plataforma.
      </p>
      <div className="flex">
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

export default connect(undefined, { onUpdateProject: updateProject })(
  ClosePostForm,
)
