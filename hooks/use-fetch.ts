import useSWR, { ConfigInterface } from 'swr'
import { dev } from '~/common/constants'

export interface UseFetchOptions<Data, Error>
  extends ConfigInterface<Data, Error> {
  context?: RequestInit
}

/**
 *
 * @param urlOrURLCreator
 * @param options
 * @example const { data, error, isValidating } = useFetch('http://google.com/api/json')
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

  return result
}

const logFetcher = (method: string = 'GET', ...args: any[]) =>
  console.log(
    `%c [FETCH] ${method}`,
    'color: green; font-size: 12px; font-weight: bolder',
    ...args,
  )
export const swrFetcher = (url: string, options?: RequestInit) => {
  if (dev) {
    logFetcher(options?.method, url)
  }

  return fetch(url, options).then(res => {
    const data = res.json()
    if (dev) {
      logFetcher(options?.method, url, data)
    }

    return data
  })
}
