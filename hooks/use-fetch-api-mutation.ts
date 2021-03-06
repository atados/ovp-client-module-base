import { API_URL } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import { useFetcher } from 'react-fetch-json-hook'
import { FetchAction } from 'react-fetch-json-hook/lib/action'
import { CHANNEL_ID } from '../common'
import { useMemo } from 'react'

type FetchAPIActionCreator<TArg = any, TMeta = any> = (
  arg?: TArg,
) =>
  | (Omit<FetchAction<TMeta>, 'url' | 'body'> & {
      body?: any
      endpoint: string
    })
  | null

const useFetchAPIMutation = <Payload>(fn: FetchAPIActionCreator) => {
  const viewer = useSelector((state: RootState) => state.user)

  const result = useFetcher<Payload>(args => {
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
        'x-ovp-channel': CHANNEL_ID,
        Authorization: viewer ? `Bearer ${viewer.token}` : '',
      },
    }
  })

  return useMemo(
    () => ({
      ...result,
      mutate: (...args: any[]) => result.fetch(...args),
    }),
    [result],
  )
}

export default useFetchAPIMutation
