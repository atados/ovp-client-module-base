import { API_URL } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import {
  useFetcher,
  UseBaseFetcherResult,
  DefaultFetchDispatcherResult,
  mutateFetchCache,
} from 'react-fetch-json-hook'
import { FetchAction } from 'react-fetch-json-hook/lib/action'
import { Config } from '~/common'

type FetchAPIActionCreator<TArg = any, TMeta = any> = (
  arg?: TArg,
) =>
  | (Omit<FetchAction<TMeta>, 'url' | 'body'> & {
      body?: any
      endpoint: string
    })
  | null

type UseFetchAPICallbackResult<TData, TArg, TMeta> = Omit<
  UseBaseFetcherResult<DefaultFetchDispatcherResult<TData>, TArg, TMeta>,
  'fetch'
> & {
  fetch: UseBaseFetcherResult<
    DefaultFetchDispatcherResult<TData>,
    TArg,
    TMeta
  >['fetch']
}

export const useAPIFetcher = <TData, TArg = any, TMeta = unknown>(
  fn: FetchAPIActionCreator,
): UseFetchAPICallbackResult<TData, TArg, TMeta> => {
  const viewer = useSelector((state: RootState) => state.user)

  return useFetcher<TData, TArg, TMeta>(args => {
    const action = fn(args)

    if (!action) {
      return null
    }

    return {
      ...action,
      url: `${API_URL}${action.endpoint}`,
      body: action.body ? JSON.stringify(action.body) : undefined,
      headers: {
        'content-type': 'application/json',
        'x-ovp-channel': Config.id,
        Authorization: viewer ? `Bearer ${viewer.token}` : '',
      },
    }
  })
}

export { mutateFetchCache }
