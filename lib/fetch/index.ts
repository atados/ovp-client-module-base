const isServer = typeof window === 'undefined'
import { Options } from './fetch.client'

const polyfilledFetch = isServer
  ? // tslint:disable-next-line:no-var-requires
    require('./fetch.server')
  : // tslint:disable-next-line:no-var-requires
    require('./fetch.client')

type FetchFunction = <Payload = any>(
  url: string,
  options?: Options,
) => Promise<Payload>
export const fetch = polyfilledFetch.fetch as FetchFunction
export const fetchJSON = polyfilledFetch.fetchJSON as FetchFunction
export const fetchAPI = polyfilledFetch.fetchAPI as FetchFunction
