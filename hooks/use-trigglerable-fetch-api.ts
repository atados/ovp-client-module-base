import { useMemo } from 'react'
import { useTriggerableFetch } from 'react-fetch-json-hook'
import { API_URL, channel } from '~/common/constants'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'

export default function useTriggerableFetchApi<Payload>(
  url: string,
  options: RequestInit = {},
) {
  const viewer = useSelector((state: RootState) => state.user)
  options.headers = {
    ...options.headers,
    'content-type': 'application/json',
    'x-ovp-channel': channel.id,
    Authorization: viewer ? `Bearer ${viewer.token}` : '',
  }

  const hook = useTriggerableFetch<Payload>(`${API_URL}${url}`, options)
  return useMemo(
    () => ({
      ...hook,
      trigger: (body?: any, overrideOptions?: RequestInit) =>
        hook.trigger(body && JSON.stringify(body), overrideOptions),
    }),
    [hook, viewer],
  )
}
