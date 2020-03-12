import { createAction, createReducer, PayloadAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { ReduxState } from '../root-reducer'
import { ProjectApplication } from './project'

export const fetchProjectApplications = createAction<
  string,
  ProjectApplication[],
  { projectSlug: string }
>(
  'PROJECT_APPLIES_FETCH',
  (slug: string, { getState }) => {
    const { user, projectApplications: currentState } = getState() as ReduxState

    if (currentState.fetched && currentState.projectSlug === slug) {
      return currentState.nodes
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    return fetchAPI(`/projects/${slug}/applies/`, {
      sessionToken: user.token,
    })
  },
  slug => ({ projectSlug: slug }),
)

export interface ProjectApplicationsReducerState {
  nodes: ProjectApplication[]
  fetched?: boolean
  projectSlug?: string
  fetching?: boolean
}

export default createReducer<ProjectApplicationsReducerState>(
  {
    [String(fetchProjectApplications)]: (
      state,
      action: PayloadAction<ProjectApplication[], { projectSlug: string }>,
    ) => ({
      fetched: !action.pending,
      projectSlug: action.meta.projectSlug,
      fetching: action.pending,
      nodes: action.error
        ? state.nodes
        : (action.payload as ProjectApplication[]),
    }),
  },
  { nodes: [] },
)
