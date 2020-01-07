import { API_URL, channel } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import { useFetch, FetchAction } from 'react-fetch-json-hook'

export default function useFetchAPI<Payload>(
  endpoint: string,
  options: Omit<FetchAction, 'url' | 'method'> & {
    id?: string
    skip?: boolean
    method?: string
  } = {},
) {
  const viewer = useSelector((state: RootState) => state.user)
  options.headers = {
    ...options.headers,
    'x-ovp-channel': channel.id,
    Authorization: viewer ? `Bearer ${viewer.token}` : '',
  }

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
