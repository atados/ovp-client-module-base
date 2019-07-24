import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { RootState } from '../root-reducer'

export const closeProject = createAction(
  'PROJECT_CLOSE',
  (projectSlug: string, { getState }) => {
    const { user } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in to close a project')
    }

    return fetchAPI<boolean>(`/projects/${projectSlug}/close/`, {
      method: 'POST',
      sessionToken: user.token,
    })
  },
  (projectSlug: string) => ({ slug: projectSlug }),
)
