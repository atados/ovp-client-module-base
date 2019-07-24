import { useMemo } from 'react'
import { useTriggerableFetch } from 'react-fetch-json-hook'
import { API_URL, channel } from '~/common/constants'

export default function useTriggerableFetchApi<Payload>(
  url: string,
  options: RequestInit = {},
) {
  options.headers = {
    ...options.headers,
    'content-type': 'application/json',
    'x-ovp-channel': channel.id,
  }

  const hook = useTriggerableFetch<Payload>(`${API_URL}${url}`, options)
  return useMemo(
    () => ({
      ...hook,
      trigger: (body?: any, overrideOptions?: RequestInit) =>
        hook.trigger(body && JSON.stringify(body), overrideOptions),
    }),
    [hook],
  )
}
