import React, { useMemo } from 'react'
import Head from 'next/head'
import {
  createClient,
  FetchProvider,
  registerClientForLocalMutations,
} from 'react-fetch-json-hook'
import { AppContextType } from 'next/dist/next-server/lib/utils'
import { getDataFromTree } from 'react-fetch-json-hook'
export const withFetch = (App: any) => {
  const WithFetch = ({ initialFetchCacheState, fetchClient, ...pageProps }) => {
    const client = useMemo(() => {
      const result =
        fetchClient ||
        createClient({ initialCacheState: initialFetchCacheState })

      if (typeof window !== 'undefined') {
        registerClientForLocalMutations(result)
      }

      return result
    }, [fetchClient])
    return (
      <FetchProvider client={client}>
        <App {...pageProps} />
      </FetchProvider>
    )
  }

  WithFetch.getInitialProps = async (ctx: AppContextType) => {
    const client = createClient({})
    const { res } = 'ctx' in ctx ? ctx.ctx : ctx
    let initialFetchCacheState: any

    // Run wrapped getInitialProps methods
    let appInitialProps = {}
    if (App.getInitialProps) {
      appInitialProps = await App.getInitialProps(ctx)
    }

    // Only on the server:
    if (typeof window === 'undefined') {
      // When redirecting, the response is finished.
      // No point in continuing to render
      if (res && res.finished) {
        return appInitialProps
      }

      try {
        initialFetchCacheState = await getDataFromTree(
          client,
          <ctx.AppTree
            pageProps={{}}
            {...appInitialProps}
            fetchClient={client}
          />,
        )
      } catch (error) {
        if (error instanceof Promise) {
          await error
        } else {
          console.error('Error while running `getDataFromTree`', error)
        }
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind()
    }

    return {
      ...appInitialProps,
      initialFetchCacheState,
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const displayName = App.displayName || App.name || 'Component'

    WithFetch.displayName = `withFetch(${displayName})`
  }

  return WithFetch
}
