import { dev } from '~/common/constants'

const logFetcher = (method: string = 'GET', ...args: any[]) =>
  // tslint:disable-next-line:no-console
  console.log(
    `%c [FETCH] ${method}`,
    'color: green; font-size: 12px; font-weight: bolder',
    ...args,
  )
export const swrFetcher = (url: string, options?: RequestInit) => {
  return fetch(url, options).then(res => {
    const data = res.json()
    if (dev) {
      logFetcher(options?.method, url, data)
    }

    return data
  })
}
