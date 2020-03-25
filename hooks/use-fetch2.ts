import useSWR, { ConfigInterface } from 'swr'
import { swrFetcher } from '~/hooks/fetch/swrFetcher'
import { useMemo } from 'react'

export interface UseFetchOptions<Data, Error>
  extends ConfigInterface<Data, Error> {
  context?: RequestInit
}

/**
 * @param urlOrURLCreator
 * @param options
 * @example const { data, error, loading } = useFetch('http://google.com/api/json')
 */
export const useFetch = <Data = any, Error = any>(
  urlOrURLCreator: string | (() => string),
  options: UseFetchOptions<Data, Error> = {},
) => {
  const result = useSWR<Data>(
    urlOrURLCreator,
    url => {
      if (url === null) {
        return Promise.resolve()
      }

      return swrFetcher(url, options.context)
    },
    options,
  )

  return useMemo(
    () => ({
      ...result,
      data: result.data,
      loading: result.isValidating,
      error: result.error,
    }),
    [result, result.data, result.error, result.isValidating],
  )
}
