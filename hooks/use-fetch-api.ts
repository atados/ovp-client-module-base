import { useFetch } from 'react-fetch-json-hook'
import { UseFetchOptions } from 'react-fetch-json-hook/lib/use-fetch'
import { API_URL, channel } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'

export default function useFetchAPI<Payload>(
  pathname: string,
  options: UseFetchOptions = {},
) {
  const viewer = useSelector((state: RootState) => state.user)
  options.headers = {
    ...options.headers,
    'x-ovp-channel': channel.id,
    Authorization: viewer ? `Bearer ${viewer.token}` : '',
  }

  return useFetch<Payload>(`${API_URL}${pathname}`, options)
}
