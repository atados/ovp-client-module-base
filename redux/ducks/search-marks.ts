import isEqual from 'fast-deep-equal'
import { createAction, createReducer, PayloadAction } from 'redux-handy'
import { channel } from '~/common/constants'
import { fetchAPI, fetchJSON } from '~/lib/fetch'
import { generateRandomId } from '~/lib/utils/string'
import { RootState } from '../root-reducer'
import {
  BaseFilters,
  mapFiltersToAPIQuery,
  NodeKind,
  SearchSource,
} from './search'

export interface MapNode {
  slug: string
  address: {
    lat: number
    lng: number
  }
}

const fetchAddressMarksNodes = async (
  nodeKind: NodeKind,
  filters: BaseFilters,
): Promise<Array<SearchSource<MapNode>>> => {
  const query = mapFiltersToAPIQuery(filters, nodeKind)
  const promises: Array<Promise<SearchSource<MapNode>>> = []
  const apiPath = `/search/${
    nodeKind === NodeKind.Organization ? 'organizations' : 'projects'
  }/map-data/`

  promises.push(
    fetchAPI<MapNode[]>(apiPath, {
      query,
    }).then(nodes => ({
      id: generateRandomId(),
      channelId: channel.id,
      count: nodes.length,
      nodeKind,
      nodes,
    })),
  )

  if (channel.integrations) {
    channel.integrations.forEach(integration => {
      promises.push(
        fetchJSON<MapNode[]>(`${integration.apiUri}${apiPath}`, {
          query,
        }).then(nodes => ({
          id: generateRandomId(),
          nodeKind,
          channelId: integration.channelId,
          count: nodes.length,
          nodes,
        })),
      )
    })
  }

  const sources = await Promise.all(promises)

  return sources
}

interface SearchAddressMeta {
  searchKind: NodeKind
  filters: BaseFilters
}

export const fetchMapMarks = createAction<
  { filters: BaseFilters; nodeKind: NodeKind },
  Array<SearchSource<MapNode>>,
  SearchAddressMeta
>(
  'SEARCH_ADDRESS_MARK_PROJECT_FETCH',
  async ({ nodeKind, filters }, { getState, prevent }) => {
    const { searchMarks } = getState() as RootState

    if (
      searchMarks.fetched &&
      searchMarks.searchKind === nodeKind &&
      isEqual(filters, searchMarks.filters)
    ) {
      prevent()
      return searchMarks.sources
    }

    return fetchAddressMarksNodes(nodeKind, filters)
  },
  ({ filters, nodeKind }) => ({ filters, searchKind: nodeKind }),
)

export interface SearchMarksReducerState {
  fetched?: boolean
  fetching?: boolean
  sources: Array<SearchSource<MapNode>>
  searchKind?: NodeKind
  filters?: BaseFilters
}

export default createReducer<SearchMarksReducerState>(
  {
    [String(fetchMapMarks)]: (
      state,
      action: PayloadAction<Array<SearchSource<MapNode>>, SearchAddressMeta>,
    ) => ({
      filters: action.meta.filters,
      fetching: action.pending,
      fetched: !action.pending,
      sources: !action.error
        ? (action.payload as Array<SearchSource<MapNode>>) || state.sources
        : state.sources,
      searchKind: action.meta.searchKind,
    }),
  },
  { sources: [] },
)
