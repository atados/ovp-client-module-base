import { createAction, createReducer, PromiseAction } from 'redux-handy'
import { getRandomColor } from '~/lib/color/manager'
import { fetchAPI } from '~/lib/fetch'
import { reportError } from '~/lib/utils/error'
import { Address, Gallery } from '~/redux/ducks/project'
import { RootState } from '~/redux/root-reducer'
import { editOrganization } from './organization-composer'
import { API } from '~/types/api'

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
  causes: API.Cause[]
  hidden_address: boolean
  description: string
  address?: Address
  website?: string
  facebook_page?: string
  instagram_user?: string
  chat_enabled: boolean
  benefited_people: number
  image?: API.ImageDict
  cover?: API.ImageDict
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
    const { user, startup, organization: currentState }: RootState = getState()

    const causes = startup?.causes || null

    if (slug === currentState.slug && currentState.node) {
      prevent()
      return currentState.node
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

    if (causes) {
      // Replace causes with global causes so we can have 'color' property
      const causesIds: number[] = organization.causes.map(cause => cause.id)
      organization.causes = causes.filter(
        cause => causesIds.indexOf(cause.id) !== -1,
      )
    }

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
