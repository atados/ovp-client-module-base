import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { ReduxState } from '../root-reducer'

export interface OrganizationMember {
  id: number
  uuid: string
  name: string
  email: string
  avatar: number
  slug: string
}

type FetchOrganizationMembersPayload = OrganizationMember[]

export const fetchOrganizationMembers = createAction<
  string,
  FetchOrganizationMembersPayload,
  string
>(
  'ORGANIZATION_MEMBERS_FETCH',
  (organizationSlug, { getState, prevent }) => {
    const { organizationMembers: currentState, user } = getState() as ReduxState

    if (!user) {
      throw new Error('You must be logged in')
    }

    if (
      organizationSlug === currentState.organizationSlug &&
      currentState.nodes
    ) {
      prevent()
      return currentState.nodes
    }

    return fetchAPI<FetchOrganizationMembersPayload>(
      `/organizations/${organizationSlug}/members/`,
      {
        sessionToken: user.token,
      },
    )
  },
  organizationSlug => organizationSlug,
)

export const inviteMember = createAction<
  { email: string; organizationSlug: string },
  boolean
>('ORGANIZATION_MEMBER_INVITE', ({ email, organizationSlug }, { getState }) => {
  const { user } = getState() as ReduxState

  if (!user) {
    throw new Error('You must be logged in')
  }

  return fetchAPI(`/organizations/${organizationSlug}/invite_user/`, {
    method: 'POST',
    body: { email },
    sessionToken: user.token,
  })
})

export interface OrganizationMembersReducerState {
  organizationSlug?: string
  fetching?: boolean
  fetched?: boolean
  error?: Error
  nodes?: FetchOrganizationMembersPayload
}

export default createReducer<OrganizationMembersReducerState>(
  {
    [String(fetchOrganizationMembers)]: (_, action) => {
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
        nodes: action.payload,
        fetched: true,
      }
    },
  },
  {},
)
