import { createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { ReduxState } from '../root-reducer'
import { Organization } from './organization'
import { Project } from './project'
import { BaseFilters, mapFiltersToAPIQuery, NodeKind } from './search'

export const fetchCatalogue = createAction<
  { slug: string; filters?: BaseFilters },
  Catalogue,
  { slug: string }
>(
  'CATALOGUE_FETCH',
  ({ slug, filters }, { getState }) => {
    const { user, catalogue: currentState } = getState() as ReduxState

    if (currentState.catalogueSlug === slug && currentState.node) {
      return currentState.node
    }

    return fetchAPI(`/catalogue/${slug}/`, {
      query: filters
        ? mapFiltersToAPIQuery(filters, NodeKind.Project)
        : undefined,
      sessionToken: user ? user.token : undefined,
    })
  },
  ({ slug }) => ({ slug }),
)

export interface CatalogueOrganizationSection {
  id: string
  name: string
  slug: string
  order: number
  type: 'organizations'
  organizations: Organization[]
}

export interface CatalogueProjectSection {
  id: string
  name: string
  slug: string
  order: number
  type: 'projects'
  projects: Project[]
}

export type CatalogueSectionType =
  | CatalogueOrganizationSection
  | CatalogueProjectSection

export interface Catalogue {
  slug: string
  sections: CatalogueSectionType[]
}

export interface CatalogueReducerState {
  node?: Catalogue
  catalogueSlug?: string
  fetched?: boolean
  fetching?: boolean
}

export default createReducer<CatalogueReducerState>(
  {
    [String(fetchCatalogue)]: (state, action) => ({
      catalogueSlug: action.meta.slug,
      fetching: action.pending,
      fetched: !action.pending,
      node: action.error ? state.node : (action.payload as Catalogue),
    }),
  },
  {},
)
