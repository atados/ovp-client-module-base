import isEqual from 'fast-deep-equal'
import { createAction, createReducer, PayloadAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { generateRandomId } from '~/lib/utils/string'
import { ReduxState } from '../root-reducer'
import {
  BaseFilters,
  mapFiltersToAPIQuery,
  NodeKind,
  SearchSource,
} from './search'
import { CHANNEL_ID } from '~/common'

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
      channelId: CHANNEL_ID,
      count: nodes.length,
      nodeKind,
      nodes,
    })),
  )

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
    const { searchMarks } = getState() as ReduxState

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
