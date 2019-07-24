import { APP_URL } from '~/common/constants'
import {
  fetch as defaultFetch,
  fetchAPI as defaultFetchAPI,
  fetchJSON as defaultFetchJSON,
  Options,
} from '~/lib/fetch/fetch.client'

const normalizeUrl = url => (url.startsWith('/') ? `${APP_URL}${url}` : url)
export const fetch = (url: string, options?: Options) =>
  defaultFetch(normalizeUrl(url), options)
export function fetchJSON<Payload>(url: string, options?: Options) {
  return defaultFetchJSON<Payload>(normalizeUrl(url), options)
}
export function fetchAPI<Payload>(url: string, options?: Options) {
  return defaultFetchAPI<Payload>(url, options)
}
