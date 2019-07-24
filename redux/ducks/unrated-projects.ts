import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { RootState } from '../root-reducer'
import { Project } from './project'

export const fetchUnratedProjects = createAction<undefined>(
  'UNRATED_PROJECTS_FETCH',
  (_, { getState, prevent }) => {
    const { user, unratedProjects: currentState } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in')
    }

    if (currentState.fetched) {
      prevent()
      return currentState.nodes
    }

    return fetchAPI('/ratings/projects_with_unrated_users/', {
      sessionToken: user.token,
    })
  },
)

export interface UnratedProjectsReducerState {
  readonly nodes: Project[]
  readonly fetching?: boolean
  readonly fetched?: boolean
}

export default createReducer<UnratedProjectsReducerState>(
  {
    [String(fetchUnratedProjects)]: (state, action) => ({
      fetching: action.pending,
      fetched: !action.pending,
      nodes: action.error ? state.nodes : action.payload || state.nodes,
    }),
  },
  { nodes: [] },
)
