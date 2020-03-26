import ApolloClient from 'apollo-client'
import next from 'next'
import { AnyAction, Store as ReduxStore } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { RootState } from '~/redux/root-reducer'

interface Store<S = any, A extends Action<any> = AnyAction>
  extends ReduxStore<S, A> {
  dispatch: ThunkDispatch<S, any, A>
}

declare module 'next' {
  export interface NextPageContext {
    store: Store<RootState>
    apolloClient: ApolloClient<any>
  }
}
