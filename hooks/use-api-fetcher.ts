import { useFetcher, FetcherAction } from './use-fetcher'
import { API_URL } from '~/common/constants'

export interface APIFetcherAction<Meta>
  extends Omit<FetcherAction<Meta>, 'url'> {
  endpoint: string
}

interface APIFetcherActionCreator<Arg, Meta> {
  (arg: Arg): APIFetcherAction<Meta> | null
}

/**
 *
 * @param actionCreator
 * @example const { data, error, action, fetch, isFetching } = useAPIFetcher(
 *   () => ({
 *     endpoint: APIEndpoint.SearchProjects(),
 *     meta: {
 *       idOfFetching: '1'
 *     }
 *   })
 * )
 */
export const useAPIFetcher = <Data = any, Arg = any, Meta = any, Error = any>(
  actionCreator: APIFetcherActionCreator<Arg, Meta>,
) => {
  return useFetcher<Data, Arg, Meta, Error>(arg => {
    const action = actionCreator(arg)

    if (action === null) {
      return null
    }

    return {
      ...action,
      url: `${API_URL}${action.endpoint}`,
    }
  })
}
