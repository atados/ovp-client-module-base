import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { ReduxState } from '../root-reducer'
import { Disponibility, Gallery, Project } from './project'

export interface ProjectPayload {
  name: string
  description: string
  details: string
  organization_id?: number
  address: {
    typed_address: string
    typed_address2: string
  }
  galleries: Array<Gallery | { id: number }>
  benefited_people?: number
  disponibility: Disponibility
  document?: string
  image_id: number
  owner?: number
  roles: Array<{
    name: string
    details: string
    prerequisites: string
    vacancies: number
  }>
  causes: Array<{ id: number }>
  skills: Array<{ id: number }>
  minimum_age?: number
}

export const addProject = createAction<ProjectPayload, Project>(
  'PROJECT_ADD',
  (payload, { getState }) => {
    const { user } = getState() as ReduxState

    if (!user) {
      throw new Error('You must be logged in')
    }

    return fetchAPI('/projects/', {
      method: 'POST',
      body: payload,
      sessionToken: user.token,
    })
  },
)

export const editProject = createAction<
  Partial<ProjectPayload> & { slug: string },
  Project
>('PROJECT_EDIT', (payload, { getState }) => {
  const { user } = getState() as ReduxState

  if (!user) {
    throw new Error('You must be logged in')
  }

  return fetchAPI(`/projects/${payload.slug}/`, {
    method: 'PATCH',
    body: payload,
    sessionToken: user.token,
  })
})

export interface ProjectComposerReducerState {
  fetching?: boolean
  node?: Project
}

export default createReducer<ProjectComposerReducerState>(
  {
    [String(addProject)]: (_, action) => ({
      fetching: action.pending,
      node: action.error ? undefined : (action.payload as Project),
    }),
    [String(editProject)]: (_, action) => ({
      fetching: action.pending,
      node: action.error ? undefined : (action.payload as Project),
    }),
  },
  {},
)
