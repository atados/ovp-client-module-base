import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { catchErrorAndReport } from '~/lib/utils/error'
import { RootState } from '../root-reducer'
import { pushToDataLayer } from '~/lib/tag-manager'

export const joinOrganization = createAction<string, boolean, string>(
  'ORGANIZATION_JOIN',
  async (organizationSlug, { getState }) => {
    const { user } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in')
    }

    const response = await fetchAPI(
      `/organizations/${organizationSlug}/join/`,
      {
        method: 'POST',
        sessionToken: user.token,
      },
    ).catch(catchErrorAndReport)

    pushToDataLayer({
      event: 'organization.join',
      userId: user.uuid,
      slug: organizationSlug,
    })

    return response
  },
  organizationSlug => organizationSlug,
)

export interface OrganizationMembershipReducerState {
  organizationSlug?: string
  fetching?: boolean
  fetched?: boolean
  error?: Error
}

export default createReducer<OrganizationMembershipReducerState>(
  {
    [String(joinOrganization)]: (_, action) => {
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
        fetched: true,
      }
    },
  },
  {},
)
