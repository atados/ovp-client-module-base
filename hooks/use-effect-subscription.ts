import { OperationVariables } from 'apollo-client'
import { DocumentNode } from 'graphql'
import { useEffect, useRef } from 'react'
import {
  OnSubscriptionData,
  SubscriptionHookOptions,
  useApolloClient,
} from 'react-apollo-hooks'
import { objToKey } from 'react-apollo-hooks/lib/utils'

export default function useEffectSubscription<
  TData = any,
  TVariables = OperationVariables
>(
  query: DocumentNode,
  {
    onSubscriptionData,
    ...options
  }: SubscriptionHookOptions<TData, TVariables> = {},
) {
  const client = useApolloClient()

  const onSubscriptionDataRef = useRef<
    OnSubscriptionData<TData> | null | undefined
  >(null)
  useEffect(() => {
    const subscription = client
      .subscribe({
        ...options,
        query,
      })
      .subscribe(
        nextResult => {
          if (onSubscriptionDataRef.current) {
            onSubscriptionDataRef.current({
              client,
              subscriptionData: {
                data: nextResult.data,
                error: undefined,
                loading: false,
              },
            })
          }
        },
        error => {
          if (onSubscriptionDataRef.current) {
            onSubscriptionDataRef.current({
              client,
              subscriptionData: {
                error,
                loading: false,
              },
            })
          }
        },
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [query, options && objToKey(options)])

  onSubscriptionDataRef.current = onSubscriptionData
}
