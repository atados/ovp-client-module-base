import { UseFetchOptions, useFetch } from '~/hooks/use-fetch2'
import { API_URL } from '~/common/constants'

/**
 *
 * @param endpointOrEndpointCreator The API endpoint to fetch from
 * @param options Options passed to SWR
 * @example const { data, error, loading} = useFetchAPI('/search/projects')
 */
export const useAPIFetch = <Data = any, Error = any>(
  endpointOrEndpointCreator: string | (() => string),
  options?: UseFetchOptions<Data, Error>,
) => {
  return useFetch(() => {
    if (typeof endpointOrEndpointCreator === 'function') {
      return `${API_URL}${endpointOrEndpointCreator()}`
    }

    return `${API_URL}${endpointOrEndpointCreator}`
  }, options)
}
