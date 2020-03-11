import useSWR, { ConfigInterface } from 'swr'
import { CHANNEL_ID } from '~/common'
import { useSelector } from 'react-redux'
import { RootState } from '~/redux/root-reducer'

export const useSWRWithExtras = <Data = any>(
  url: string,
  options: ConfigInterface<Data, Error> & { context?: RequestInit } = {},
) => {
  const viewer = useSelector((state: RootState) => state.user)
  const result = useSWR<Data>(
    url,
    () =>
      swrFetcher({
        ...options.context,
        headers: {
          ...options.context?.headers,
          Authorization: viewer ? `Bearer ${viewer.token}` : '',
          'x-ovp-channel': CHANNEL_ID,
        },
        url,
      }),
    options,
  )

  return result
}

export interface SWRAction extends RequestInit {
  url: string
}

export const swrFetcher = (action: SWRAction) => {
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line:no-console
    console.log(
      '%c SWR',
      'color: green; font-size: 12px; font-weight: bolder',
      action,
    )
  }
  return fetch(action.url, action).then(res => res.json())
}
