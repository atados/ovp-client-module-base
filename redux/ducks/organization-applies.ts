import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { RootState } from '../root-reducer'
import { ProjectApplication } from './project'

export interface OrganizationAppliesPayload {
  applied_count: number
  applies: ProjectApplication[]
}

export const fetchOrganizationApplies = createAction<
  string,
  OrganizationAppliesPayload,
  string
>(
  'ORGANIZATION_APPLIES_FETCH',
  (organizationSlug, { getState, prevent }) => {
    const { organizationApplies: currentState } = getState() as RootState

    if (
      organizationSlug === currentState.organizationSlug &&
      currentState.payload
    ) {
      prevent()
      return currentState.payload
    }

    return fetchAPI<OrganizationAppliesPayload>(
      `/organizations/${organizationSlug}/applies/`,
    )
  },
  organizationSlug => organizationSlug,
)

export interface OrganizationAppliesReducerState {
  organizationSlug?: string
  fetching?: boolean
  fetched?: boolean
  error?: Error
  payload?: OrganizationAppliesPayload
}

export default createReducer<OrganizationAppliesReducerState>(
  {
    [String(fetchOrganizationApplies)]: (_, action) => {
      if (action.pending) {
        return {
          organizationSlug: action.meta,
          fetching: action.pending,
          fetched: false,
        }
      }

      if (action.error) {
        return {
          organizationSlug: action.meta,
          error: action.payload,
          fetched: true,
        }
      }

      return {
        organizationSlug: action.meta,
        payload: action.payload,
        fetched: true,
      }
    },
  },
  {},
)
