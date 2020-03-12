import { useState, useMemo, useCallback } from 'react'
import { swrFetcher } from '~/hooks/use-fetch'

export interface FetcherAction<Meta = any> extends Omit<RequestInit, 'body'> {
  url: string
  meta?: Meta
  body?: any
}

export interface FetcherActionCreator<Arg, Meta> {
  (arg: Arg): FetcherAction<Meta> | null
}

interface UseFetcherState<Data, Error, ActionMeta> {
  isFetching: boolean
  data?: Data
  error?: Error
  action?: FetcherAction<ActionMeta>
}

/**
 *
 * @param actionCreator
 * @example const { data, error, action, fetch, isFetching } = useAPIFetcher(
 *   values => ({
 *     method: 'POST',
 *     url: 'http://google.com/api/json',
 *     body: JSON.stringify(values),
 *     meta: {
 *       idOfFetching: '1'
 *     }
 *   })
 * )
 *
 * const handleSubmit = values => fetch(values)
 */
export const useFetcher = <Data = any, Arg = any, Meta = any, Error = any>(
  actionCreator: FetcherActionCreator<Arg, Meta>,
) => {
  const [state, setState] = useState<UseFetcherState<Data, Error, Meta>>({
    isFetching: false,
  })
  const fetchFn = useCallback(
    async (arg?: Arg) => {
      const action = actionCreator(arg)

      if (action === null) {
        return null
      }

      setState({ isFetching: true, action })
      try {
        const bodyIsJSON = typeof action.body === 'object'
        const data = await swrFetcher(
          action.url,
          bodyIsJSON
            ? {
                ...action,
                body: JSON.stringify(action.body),
                headers: {
                  ...action.headers,
                  'Content-Type': 'application/json',
                },
              }
            : action,
        )
        setState({ isFetching: false, data, action })
        return data
      } catch (error) {
        setState({ isFetching: false, error, action })
        throw error
      }
    },
    [actionCreator],
  )

  return useMemo(
    () => ({
      ...state,
      fetch: fetchFn,
    }),
    [state],
  )
}
