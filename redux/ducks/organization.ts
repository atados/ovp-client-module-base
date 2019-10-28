import { createAction, createReducer, PromiseAction } from 'redux-handy'
import { getRandomColor } from '~/lib/color/manager'
import { fetchAPI } from '~/lib/fetch'
import { FetchJSONError } from '~/lib/fetch/fetch.client'
import { reportError } from '~/lib/utils/error'
import { Address, Gallery } from '~/redux/ducks/project'
import { RootState } from '~/redux/root-reducer'
import { Cause, ImageDict } from '~/common/channel'
import { editOrganization } from './organization-composer'

export interface Organization {
  id?: number
  slug: string
  color: string
  name: string
  details: string
  projects_count: number
  document: string | null
  published: boolean
  contact_email: string
  contact_phone: string
  causes: Cause[]
  hidden_address: boolean
  description: string
  address?: Address
  website?: string
  facebook_page?: string
  chat_enabled: boolean
  benefited_people: number
  image?: ImageDict
  cover?: ImageDict
  rating: number
  verified: boolean
  galleries: Gallery[]
}

interface OrganizationFetchMeta {
  slug: string
}
export const fetchOrganization = createAction<
  string,
  Organization,
  OrganizationFetchMeta
>(
  'ORGANIZATION_FETCH',
  async (slug, { prevent, getState }) => {
    const {
      user,
      startup: { causes },
      organization: currentState,
    }: RootState = getState()

    if (slug === currentState.slug) {
      prevent()

      if (currentState.node) {
        return currentState.node
      }

      throw new FetchJSONError(
        { statusCode: 404, url: `/organization/${slug}` },
        undefined,
      )
    }

    const organization = await fetchAPI<Organization>(
      `/organizations/${slug}/`,
      {
        sessionToken: user ? user.token : undefined,
      },
    ).catch(error => {
      if (error && error.statusCode !== 404) {
        reportError(error)
      }

      throw error
    })

    organization.color = getRandomColor()

    // Replace causes with global causes so we can have 'color' property
    const causesIds: number[] = organization.causes.map(cause => cause.id)
    organization.causes = causes.filter(
      cause => causesIds.indexOf(cause.id) !== -1,
    )

    return organization
  },
  slug => ({ slug }),
)

export interface OrganizationReducerState {
  node?: Organization
  slug?: string
  fetching?: boolean
}

export default createReducer<OrganizationReducerState>(
  {
    [String(editOrganization)]: (state, action) => {
      if (
        action.payload &&
        !action.error &&
        state.node &&
        state.node.slug === action.payload.slug
      ) {
        return {
          ...state,
          node: {
            ...state.node,
            ...action.payload,
          },
        }
      }

      return state
    },
    [String(fetchOrganization)]: (
      _,
      action: PromiseAction<Organization, OrganizationFetchMeta>,
    ) => ({
      slug: action.meta.slug,
      fetching: action.pending,
      node: !action.error ? (action.payload as Organization) : undefined,
    }),
  },
  { fetching: false },
)
