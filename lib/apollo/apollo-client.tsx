import { ApolloClient } from 'apollo-client'
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { NextPageContext } from 'next'
//import introspectionQueryResultData from 'generated/api/schema.json'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import { NOTIFICATIONS_API_URL } from '~/common/constants'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  //introspectionQueryResultData,
})

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerProps
 * @param {NextPageContext | NextAppContext} ctx
 */
export const initApolloClientOnContext = (
  ctx: NextPageContext,
): NextPageContext => {
  const inAppContext = Boolean((ctx as any).ctx)

  // We consider installing `withApollo({ ssr: true })` on global App level
  // as antipattern since it disables project wide Automatic Static Optimization.
  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n',
      )
    }
  }

  // Initialize ApolloClient if not already done
  const apolloClient =
      ctx.apolloClient ||
      initApolloClient(
        (ctx as any).apolloState || {},
        inAppContext ? (ctx as any).ctx : ctx,
      )

    // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
    // Otherwise, the component would have to call initApollo() again but this
    // time without the context. Once that happens, the following code will make sure we send
    // the prop as `null` to the browser.
  ;(apolloClient as any).toJSON = () => null

  // Add apolloClient to NextPageContext & NextAppContext.
  // This allows us to consume the apolloClient inside our
  // custom `getInitialProps({ apolloClient })`.
  ctx.apolloClient = apolloClient
  if (inAppContext) {
    ;(ctx as any).ctx.apolloClient = apolloClient
  }

  return ctx
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {NormalizedCacheObject} initialState
 * @param  {NextPageContext} ssr
 */
export const initApolloClient = (
  initialState?: any,
  ssr?: boolean,
): ApolloClient<NormalizedCacheObject> => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ssr)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ssr)
  }

  return globalApolloClient
}

function createApolloClient(
  initialState?: any,
  ssr?: boolean,
): ApolloClient<NormalizedCacheObject> {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  const authLink = setContext((_, { headers }) => {
    if (typeof window === 'undefined') {
      return { headers }
    }
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('sessionToken')
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  })
  const httpLink = new HttpLink({
    uri: NOTIFICATIONS_API_URL,
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetch,
  })

  return new ApolloClient({
    ssrMode: ssr,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ fragmentMatcher }).restore(initialState),
  })
}
