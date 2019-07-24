import { useFetch } from 'react-fetch-json-hook'
import { UseFetchOptions } from 'react-fetch-json-hook/lib/use-fetch'
import { API_URL, channel } from '~/common/constants'

export default function useFetchAPI<Payload>(
  pathname: string,
  options: UseFetchOptions = {},
) {
  options.headers = {
    ...options.headers,
    'x-ovp-channel': channel.id,
  }

  return useFetch<Payload>(`${API_URL}${pathname}`, options)
}
