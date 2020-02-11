import { API_URL } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import { useFetch, FetchAction } from 'react-fetch-json-hook'
import { CHANNEL_ID } from '../common'

export default function useFetchAPI<Payload>(
  endpointOrOptions:
    | string
    | (Omit<FetchAction, 'url' | 'method'> & {
        id?: string
        skip?: boolean
        endpoint: string
        method?: string
      }),
  orOptions: Omit<FetchAction, 'url' | 'method'> & {
    id?: string
    skip?: boolean
    method?: string
  } = {},
) {
  const isAction = typeof endpointOrOptions === 'object'
  const options = isAction ? (endpointOrOptions as any) : orOptions
  const viewer = useSelector((state: RootState) => state.user)
  options.headers = {
    ...options.headers,
    'x-ovp-channel': CHANNEL_ID,
    Authorization: viewer ? `Bearer ${viewer.token}` : '',
  }

  const endpoint: string = isAction
    ? (endpointOrOptions as any).endpoint
    : endpointOrOptions
  return useFetch<Payload>(
    options.skip
      ? null
      : {
          ...options,
          method: options.method || 'GET',
          url: `${API_URL}${endpoint}`,
        },
  )
}
