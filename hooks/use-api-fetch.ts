import { UseFetchOptions, useFetch } from '~/hooks/use-fetch2'
import { API_URL } from '~/common/constants'
import { useMemo } from 'react'

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
  const result = useFetch(() => {
    if (typeof endpointOrEndpointCreator === 'function') {
      return `${API_URL}${endpointOrEndpointCreator()}`
    }

    return `${API_URL}${endpointOrEndpointCreator}`
  }, options)

  return useMemo(
    () => ({
      ...result,
      data: result.data,
      loading: result.isValidating,
      error: result.error,
    }),
    [result.data, result.isValidating, result.error],
  )
}
