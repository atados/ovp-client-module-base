import isEqual from 'fast-deep-equal'
import {
  combineActions,
  createAction,
  createReducer,
  PromiseAction,
} from 'redux-handy'
import { channel } from '~/common/constants'
import { fetchAPI, fetchJSON } from '~/lib/fetch'
import { ensureHttpsUri, generateRandomId } from '~/lib/utils/string'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
import { RootState } from '~/redux/root-reducer'

export enum SearchType {
  Any,
  Projects,
  Organizations,
}

export enum NodeKind {
  Project,
  Organization,
  User,
}
export type DisponibilityFilterValue = 'work' | 'job' | 'both'

export interface BaseFiltersJSON {
  address?: string
  remoteOnly?: string
  disponibility?: DisponibilityFilterValue
  length?: number
  page?: number
  query?: string
  causes?: string | string[]
  skills?: string | string[]
}

export interface BaseFilters {
  ordering?: string
  published?: 'true' | 'both' | 'false'
  closed?: 'true' | 'both' | 'false'
  remoteOnly?: boolean
  disponibility?: DisponibilityFilterValue
  length?: number
  page?: number
  organization_id?: number
  query?: string
  causes?: number[]
  skills?: number[]
  address?: {
    id?: string
    description?: string
    address_components: Array<{
      types: string[]
      long_name: string
    }>
  }
}

export interface SearchAnyFilters extends BaseFilters {
  projectsLength?: number
  organizationsLength?: number
}

export interface SearchMeta {
  page: number
  filters: BaseFilters
  searchType: SearchType
}

export interface SearchSource<P> {
  id: string
  channelId: string
  nodeKind: NodeKind
  nextURI?: string
  count: number
  nodes: P[]
}

export interface ApiPagination<P> {
  results: P[]
  count: number
  next?: string
}

interface ApiPaginationQuery {
  ordering?: string
  published?: 'true' | 'both' | 'false'
  closed?: 'true' | 'both' | 'false'
  organization?: number
  query?: string
  page_size?: number
  cause?: string
  skill?: string
  address?: string
  disponibility?: 'remotely' | 'work' | 'job'
}

export const mapQueryToFilters = (json: BaseFiltersJSON): BaseFilters => {
  const filters: BaseFilters = {}

  Object.keys(json).forEach(key => {
    if (json[key] !== undefined) {
      if (key === 'remoteOnly') {
        filters.remoteOnly = json[key] === 'true'
        return
      }

      if (key === 'address') {
        filters.address = JSON.parse(json.address as string)
        return
      }

      if (key === 'causes' || key === 'skills') {
        filters[key] = json[key]
          ? Array.isArray(json[key])
            ? (json[key] as string[]).map(x => parseInt(x, 10))
            : [parseInt(json[key] as string, 10)]
          : []
        return
      }

      filters[key] = json[key]
    }
  })

  return filters
}

export const mapFiltersToQueryObject = (
  filters?: BaseFilters,
): BaseFiltersJSON => {
  const json: BaseFiltersJSON = {}

  if (!filters) {
    return json
  }

  Object.keys(filters).forEach(key => {
    if (key === 'address') {
      return (json[key] = JSON.stringify(filters.address))
    }

    if (key === 'remoteOnly' && filters[key] === true) {
      json[key] = 'true'
    }

    if (filters[key] !== undefined) {
      json[key] = filters[key]
    }
  })

  return json
}

export const mapFiltersToAPIQuery = (
  filters: BaseFilters,
  nodeKind: NodeKind,
) => {
  const query: ApiPaginationQuery = {
    // Defaults
    published: filters.published,
    closed: filters.closed,
    ordering:
      filters.ordering || '-highlighted,-published_date,-created_date,-closed',
  }

  if (filters.address) {
    query.address = JSON.stringify(filters.address)
  }

  if (filters.causes && filters.causes.length) {
    query.cause = filters.causes.join(',')
  }

  if (filters.query) {
    query.query = filters.query
  }

  if (filters.skills && filters.skills.length) {
    query.skill = filters.skills.join(',')
  }

  if (filters.length) {
    query.page_size = filters.length
  }

  if (nodeKind === NodeKind.Project) {
    if (filters.remoteOnly) {
      query.disponibility = 'remotely'
    } else if (filters.disponibility && filters.disponibility !== 'both') {
      query.disponibility = filters.disponibility
    }

    if (filters.organization_id) {
      query.organization = filters.organization_id
    }
  }

  return query
}

async function searchNodes<P>(
  apiPath: string,
  filters: BaseFilters,
  nodeKind: NodeKind,
  getState: () => RootState,
) {
  const { user } = getState()
  const promises: Array<Promise<SearchSource<P>>> = []
  const query = mapFiltersToAPIQuery(filters, nodeKind)

  promises.push(
    fetchAPI<ApiPagination<P>>(apiPath, {
      query,
      sessionToken: user ? user.token : undefined,
    }).then(resp => ({
      id: generateRandomId(),
      nodeKind,
      channelId: channel.id,
      nextURI: resp.next ? ensureHttpsUri(resp.next) : undefined,
      count: resp.count,
      nodes: resp.results as P[],
    })),
  )

  if (channel.integrations) {
    channel.integrations.forEach(integration => {
      promises.push(
        fetchJSON<ApiPagination<P>>(`${integration.apiUri}${apiPath}`, {
          query,
        }).then(resp => ({
          id: generateRandomId(),
          nodeKind,
          channelId: integration.channelId,
          nextURI: resp.next ? ensureHttpsUri(resp.next) : undefined,
          count: resp.count,
          nodes: resp.results as P[],
        })),
      )
    })
  }

  const sources = await Promise.all<SearchSource<P>>(promises)

  return sources
}

export const searchProjects = createAction<
  BaseFilters,
  Array<SearchSource<Project>>,
  SearchMeta
>(
  'SEARCH_PROJECTS',
  (filters, { getState, prevent }) => {
    const { search: currentState }: RootState = getState()

    if (
      currentState.searchType === SearchType.Projects &&
      isEqual(filters, currentState.filters)
    ) {
      prevent()

      return currentState.sources as Array<SearchSource<Project>>
    }

    return searchNodes<Project>(
      '/search/projects',
      filters,
      NodeKind.Project,
      getState as () => RootState,
    )
  },
  // Meta creator
  filters => ({
    searchType: SearchType.Projects,
    page: filters.page !== undefined ? filters.page : 1,
    filters,
  }),
)

export const searchOrganizations = createAction<
  BaseFilters,
  Array<SearchSource<Organization>>,
  SearchMeta
>(
  'SEARCH_ORGANIZATIONS',
  (filters, { getState }) => {
    return searchNodes<Organization>(
      '/search/organizations',
      filters,
      NodeKind.Organization,
      getState as () => RootState,
    )
  },
  // Meta creator
  filters => ({
    searchType: SearchType.Organizations,
    page: filters.page !== undefined ? filters.page : 1,
    filters,
  }),
)

export const search = createAction<
  SearchAnyFilters,
  Array<SearchSource<Project | Organization>>,
  SearchMeta
>(
  'SEARCH',
  async (
    { projectsLength, organizationsLength, ...filters },
    { getState, prevent },
  ) => {
    const { search: currentState }: RootState = getState()

    if (
      currentState.searchType === SearchType.Any &&
      isEqual(filters, currentState.filters)
    ) {
      prevent()

      return currentState.sources
    }

    const projectSources = await searchNodes<Project>(
      '/search/projects',
      { ...filters, length: projectsLength },
      NodeKind.Project,
      getState as () => RootState,
    )

    const organizationSources = await searchNodes<Organization>(
      '/search/organizations',
      { ...filters, length: organizationsLength },
      NodeKind.Organization,
      getState as () => RootState,
    )

    return [...organizationSources, ...projectSources]
  },
  // Meta creator
  ({ projectsLength, organizationsLength, ...filters }) => ({
    searchType: SearchType.Any,
    page: filters.page !== undefined ? filters.page : 1,
    filters,
  }),
)

export const fetchNextSearchPage = createAction<
  string[],
  Array<SearchSource<Project | Organization>>
>(
  'SEARCH_FETCH_NEXT_PAGE',
  async (sourceIds: string[], { prevent, getState }) => {
    const {
      search: { fetching, sources },
    } = getState()

    if (fetching) {
      prevent()
      return []
    }

    const nextSources = sources.filter(
      source => source.nextURI && sourceIds.indexOf(source.id) !== -1,
    )

    if (nextSources.length === 0) {
      prevent()
      return []
    }

    return Promise.all<SearchSource<Organization | Project>>(
      nextSources.map(source =>
        fetchJSON<ApiPagination<Organization | Project>>(source.nextURI, {
          headers: {
            'x-ovp-channel': channel.id,
          },
        }).then(resp => ({
          id: source.id,
          nodeKind: source.nodeKind,
          channelId: source.channelId,
          nextURI: resp.next ? ensureHttpsUri(resp.next) : resp.next,
          count: resp.count,
          nodes: resp.results,
        })),
      ),
    )
  },
)

export interface SearchReducerState {
  error?: Error
  page: number
  count: number
  fetched?: boolean
  fetching?: boolean
  filters?: BaseFilters
  sources: Array<SearchSource<Project | Organization>>
  searchType?: SearchType
}

function reduceSourcesCount(sources: Array<SearchSource<any>>): number {
  let count = 0

  sources.forEach(source => {
    count += source.count
  })

  return count
}

export default createReducer<SearchReducerState>(
  {
    [String(fetchNextSearchPage)]: (
      state,
      action: PromiseAction<Array<SearchSource<Project>>>,
    ) => {
      const sources =
        !action.error && action.payload
          ? state.sources.map(source => {
              const nextSource = (action.payload as Array<
                SearchSource<Project | Organization>
              >).find(s => s.id === source.id)

              if (nextSource) {
                return {
                  ...source,
                  nextURI: nextSource.nextURI,
                  nodes: [...source.nodes, ...nextSource.nodes],
                }
              }

              return source
            })
          : state.sources
      return {
        ...state,
        page: state.page ? state.page + 1 : 2,
        sources,
        fetching: action.pending,
        fetched: !!action.payload,
        count: reduceSourcesCount(sources),
        error: action.error ? (action.payload as Error) : undefined,
      }
    },
    [combineActions(
      String(search),
      String(searchOrganizations),
      String(searchProjects),
    )]: (
      state,
      action: PromiseAction<Array<SearchSource<Project>>, SearchMeta>,
    ) => {
      const sources =
        !action.error && action.payload
          ? (action.payload as Array<SearchSource<Project | Organization>>)
          : state.sources
      return {
        sources,
        page: action.meta.page,
        searchType: action.meta.searchType,
        fetching: action.pending,
        fetched: !!action.payload,
        filters: action.meta.filters,
        count: reduceSourcesCount(sources),
        error: action.error ? (action.payload as Error) : undefined,
      }
    },
  },
  { sources: [], count: 0, page: 0 },
)
