import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { RootState } from '../root-reducer'
import { Organization } from './organization'

interface OrganizationPayload {
  name: string
  description: string
  details: string
  address: {
    typed_address: string
    typed_address2: string
  }
  benefited_people?: number
  hidden_address: boolean
  document?: string
  image_id: number
  contact_phone: string
  contact_email: string
  facebook_page?: string
  website?: string
  causes: Array<{ id: number }>
}

export const addOrganization = createAction<OrganizationPayload, Organization>(
  'ORGANIZATION_ADD',
  (payload, { getState }) => {
    const { user } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in')
    }

    return fetchAPI('/organizations/', {
      method: 'POST',
      body: payload,
      sessionToken: user.token,
    })
  },
)

export const editOrganization = createAction<
  OrganizationPayload & { slug: string },
  Organization
>('ORGANIZATION_EDIT', (payload, { getState }) => {
  const { user } = getState() as RootState

  if (!user) {
    throw new Error('You must be logged in')
  }

  return fetchAPI(`/organizations/${payload.slug}/`, {
    method: 'PATCH',
    body: payload,
    sessionToken: user.token,
  })
})

export interface OrganizationComposerReducerState {
  fetching?: boolean
  node?: Organization
}

export default createReducer<OrganizationComposerReducerState>(
  {
    [String(addOrganization)]: (_, action) => ({
      fetching: action.pending,
      node: action.error ? undefined : (action.payload as Organization),
    }),
    [String(editOrganization)]: (_, action) => ({
      fetching: action.pending,
      node: action.error ? undefined : (action.payload as Organization),
    }),
  },
  {},
)
