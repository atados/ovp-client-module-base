import React, { useMemo } from 'react'
import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import { initApolloClientOnContext, initApolloClient } from './apollo-client'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextPage, NextPageContext } from 'next'

interface WithApolloProps {
  apolloClient?: ApolloClient<NormalizedCacheObject>
  apolloState: NormalizedCacheObject
}

/**
 * Creates a withApollo HOC
 * that provides the apolloContext
 * to a next.js Page or AppTree.
 * @param  {Object} withApolloOptions
 * @param  {Boolean} [withApolloOptions.ssr=false]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */
export const withApollo = (PageComponent: any, { ssr = false } = {}) => {
  const WithApollo: NextPage<WithApolloProps, {}> = ({
    apolloClient,
    apolloState,
    ...pageProps
  }) => {
    const client = useMemo(() => {
      const apolloClient = initApolloClient(apolloState, undefined)
      if (apolloState) {
        const prevCacheState = apolloClient.cache.extract() || {}
        Object.keys(apolloState).forEach(id => {
          if (!prevCacheState[id]) {
            apolloClient.writeData({ id, data: apolloState[id] })
          }
        })
      }

      return apolloClient
    }, [apolloState, apolloClient])

    return (
      <ApolloProvider client={client!}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'
    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr) {
    WithApollo.getInitialProps = async (ctx: NextPageContext) => {
      const inAppContext = 'ctx' in ctx
      const { apolloClient } = initApolloClientOnContext(ctx)

      // Run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx as any)
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        const { AppTree } = ctx
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        // Only if dataFromTree is enabled
        if (ssr && AppTree) {
          try {
            // Import `@apollo/react-ssr` dynamically.
            // We don't want to have this in our client bundle.
            const { getDataFromTree } = await import('@apollo/react-ssr')

            // Since AppComponents and PageComponents have different context types
            // we need to modify their props a little.
            let props
            if (inAppContext) {
              props = { ...pageProps, apolloClient }
            } else {
              props = { pageProps: { ...pageProps, apolloClient } }
            }

            // Take the Next.js AppTree, determine which queries are needed to render,
            // and fetch them. This method can be pretty slow since it renders
            // your entire AppTree once for every query. Check out apollo fragments
            // if you want to reduce the number of rerenders.
            // https://www.apollographql.com/docs/react/data/fragments/
            await getDataFromTree(<AppTree {...props} />)
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error)
          }
        }
      }

      return {
        ...pageProps,
        // Extract query data from the Apollo store
        apolloState: apolloClient.cache.extract(),
        // Provide the client for ssr. As soon as this payload
        // gets JSON.stringified it will remove itself.
        apolloClient: ctx.apolloClient,
      }
    }
  }

  return WithApollo
}
