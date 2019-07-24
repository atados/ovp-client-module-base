import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import fetch from 'isomorphic-unfetch'
import { NextComponentType } from 'next'
import { NextAppContext } from 'next/app'
import Head from 'next/head'
import * as React from 'react'
import { ApolloProvider, getMarkupFromTree } from 'react-apollo-hooks'
import { renderToString } from 'react-dom/server'
import {
  createFetchConnector,
  createSSRManager,
  FetchHookProvider,
} from 'react-fetch-json-hook'
import { FetchSSRManagerContext } from 'react-fetch-json-hook/lib/get-markup-from-tree'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import {
  channel,
  dev,
  SOCKET_API_URL,
  SOCKET_API_WS_URL,
} from '~/common/constants'
import { RootState } from '~/redux/root-reducer'
import getDataIdFromObject from './data-id-from-object'
import fragmentTypes from './fragment-types.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
})

declare global {
  namespace NodeJS {
    interface Process {
      browser: boolean
    }
  }
}
// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  // @ts-ignore
  global.fetch = fetch
}

interface ApolloClientCreationOptions {
  authorization?: string
}

function createApolloClient(
  initialState,
  options?: ApolloClientCreationOptions,
) {
  let apolloLink: WebSocketLink | ApolloLink | undefined
  if (process.browser) {
    const client = new SubscriptionClient(`${SOCKET_API_WS_URL}/graphql`, {
      reconnect: true,
      connectionParams: {
        authorization: options ? options.authorization : undefined,
      },
    })

    apolloLink = new WebSocketLink(client)
  } else {
    apolloLink = createHttpLink({
      uri: `${SOCKET_API_URL}/graphql`,
      headers: {
        Authorization: options ? options.authorization : undefined,
      },
    })
  }

  return new ApolloClient({
    connectToDevTools: process.browser,
    // Disables forceFetch on the server (so queries are only run once)
    ssrMode: !process.browser,
    link: apolloLink,
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: getDataIdFromObject,
    }).restore(initialState || {}),
  })
}

let apolloClient: ApolloClient<any> | undefined

function getApolloClient(
  initialState?: any,
  options?: ApolloClientCreationOptions,
): ApolloClient<any> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createApolloClient(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, options)
  }

  return apolloClient
}

const { useMemo } = React

interface WrapperComponentProps {
  readonly initialApolloState: any
  readonly initialFetchCacheState: any
  readonly initialProps: any
  readonly apolloConnectionEnabled: boolean
  readonly apolloOptions?: ApolloClientCreationOptions
}

export default (Component: NextComponentType | any) => {
  const WrapperComponent = ({
    initialApolloState,
    initialProps,
    apolloOptions,
    apolloConnectionEnabled,
    initialFetchCacheState,
    ...props
  }: WrapperComponentProps) => {
    const client = useMemo(
      () =>
        apolloConnectionEnabled
          ? getApolloClient(initialApolloState, apolloOptions)
          : undefined,
      [],
    )
    const fetchConnector = useMemo(
      () =>
        createFetchConnector({
          requestHeaders: apolloOptions
            ? {
                Authorization: apolloOptions.authorization,
              }
            : undefined,
          initialState: initialFetchCacheState,
        }),
      [],
    )

    if (dev && process.browser) {
      // @ts-ignore
      window.__FETCH_CONNECTOR__ = fetchConnector
    }

    const children = (
      <FetchHookProvider connector={fetchConnector}>
        <Component {...props} {...initialProps} apolloClient={apolloClient} />
      </FetchHookProvider>
    )

    return client ? (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ) : (
      children
    )
  }

  WrapperComponent.getInitialProps = async (context: NextAppContext) => {
    let initialProps = {}
    if ('getInitialProps' in Component) {
      initialProps = await Component.getInitialProps.call(Component, context)
    }

    const { user } = context.ctx.store.getState() as RootState
    let client: ApolloClient<any> | undefined
    let apolloOptions: ApolloClientCreationOptions | undefined
    let initialFetchCacheState

    if (user) {
      apolloOptions = {
        authorization: `Bearer ${user.token}`,
      }
    }

    // Only connect to socket if chat is enabled and the user is authorized to access it
    if (
      user &&
      channel.config.chat.enabled &&
      (!channel.config.chat.beta || user.chat_enabled)
    ) {
      client = getApolloClient(undefined, apolloOptions)
      context.ctx.apolloClient = client
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    if (!process.browser) {
      const fetchFetchSSRManager = createSSRManager()
      const fetchConnector = createFetchConnector({
        requestHeaders: {
          Authorization: user ? `Bearer ${user.token}` : undefined,
        },
      })

      try {
        const tree = (
          <FetchSSRManagerContext.Provider value={fetchFetchSSRManager}>
            <FetchHookProvider connector={fetchConnector}>
              {client ? (
                <ApolloProvider client={client}>
                  <Component
                    {...initialProps}
                    Component={context.Component}
                    router={context.router}
                    apolloClient={apolloClient}
                  />
                </ApolloProvider>
              ) : (
                <Component
                  {...initialProps}
                  Component={context.Component}
                  router={context.router}
                  apolloClient={apolloClient}
                />
              )}
            </FetchHookProvider>
          </FetchSSRManagerContext.Provider>
        )

        // Run all GraphQL queries
        await getMarkupFromTree({
          renderFunction: renderToString,
          tree,
        })
      } catch (error) {
        if (error instanceof Promise) {
          await error
        } else {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error)
        }
      }

      try {
        await fetchFetchSSRManager.consumeAndAwaitPromises()
        initialFetchCacheState = fetchConnector.cache
      } catch (error) {
        if (error instanceof Promise) {
          await error
        } else {
          console.error(
            'Error while running `fetchFetchSSRManager.extract`',
            error,
          )
        }
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind()
    }

    return {
      apolloConnectionEnabled: Boolean(client),
      apolloOptions,
      initialProps,
      initialApolloState: client && client.cache.extract(),
      initialFetchCacheState,
    }
  }
  WrapperComponent.displayName = `withApollo(${Component.displayName || 'App'})`

  return WrapperComponent
}
