import isPlainObject from 'is-plain-object'
import isoFetch from 'isomorphic-fetch'
import queryString from 'query-string'
import { API_URL, channel } from '~/common/constants'

export interface Options {
  asJSON?: boolean
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: object
  body?: FormData | object | string
  headers?: { [key: string]: any }
  sessionToken?: string
}

export class FetchJSONError extends Error {
  public statusCode: number
  public response: any
  public payload: any

  constructor(
    response: { url: string; status: number },
    payload: any,
    fixedUrl?: string,
  ) {
    if (response instanceof Error) {
      super(response.message)

      this.payload = response
      this.statusCode = response.status
      this.response = response
      return
    }

    super(
      `Failed to fetch ${fixedUrl || response.url}\nPayload = ${JSON.stringify(
        payload,
      )}`,
    )

    this.statusCode = response.status
    this.response = response
    this.payload = payload
  }
}

export function fetch(baseUri: string, options: Options = {}) {
  let url = baseUri

  // Ensure options.headers exists
  options.headers = options.headers || {}
  options.headers['Accept-Language'] =
    options.headers['Accept-Language'] || 'pt-br'

  if (options) {
    if (isPlainObject(options.body)) {
      options.body = JSON.stringify(options.body)
      options.headers['Content-Type'] = 'application/json'
    }

    if (options.query) {
      const markIndex = url.indexOf('?')
      let strinfiedQuery = queryString.stringify(options.query as any, {
        encode: false,
      })

      if (markIndex === -1) {
        url += `?${strinfiedQuery}`
      } else {
        if (markIndex !== url.length - 1) {
          strinfiedQuery += '&'
        }

        url = url.replace('?', `?${strinfiedQuery}`)
      }
    }
  }

  return isoFetch(url, options).then(response => {
    if (response.status >= 300) {
      throw response
    }

    return response
  })
}

export function fetchJSON<Payload>(
  url: string,
  options?: Options,
): Promise<Payload> {
  return fetch(url, options)
    .then(response => {
      if (response.statusCode === 204) {
        return null
      }

      return response.json()
    })
    .catch(response => {
      if (response.statusCode === 204) {
        return null
      }

      if (
        response.headers &&
        response.headers.get('content-type').indexOf('application/json') !==
          -1 &&
        response.json
      ) {
        return response.json().then(json => {
          throw new FetchJSONError(response, json)
        })
      }

      if (response.text) {
        return response.text().then(text => {
          throw new FetchJSONError(response, text)
        })
      }

      throw new FetchJSONError(response, response.statusText, url)
    })
}

export function fetchAPI<Payload>(url: string, options: Options = {}) {
  options.headers = options.headers || {}

  if (options.sessionToken) {
    options.headers.Authorization = `Bearer ${options.sessionToken}`
    delete options.sessionToken
  }

  // Include channelId header
  options.headers['x-ovp-channel'] = channel.id

  if (options.asJSON === false) {
    return fetch(`${API_URL}${url}`, options)
  }

  return fetchJSON<Payload>(`${API_URL}${url}`, options)
}
