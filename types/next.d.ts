import ApolloClient from 'apollo-client'
import next from 'next'
import { AnyAction, Store as ReduxStore } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ReduxState } from '~/redux/root-reducer'

interface Store<S = any, A extends Action<any> = AnyAction>
  extends ReduxStore<S, A> {
  dispatch: ThunkDispatch<S, any, A>
}

declare module 'next' {
  export interface NextPageContext {
    store: Store<ReduxState>
    apolloClient: ApolloClient<any>
    intl: NextIntl
  }

  export interface NextIntl {
    locale: string
    messages: {
      [messageId: string]: string
    }
    initialNow: number
  }
}
