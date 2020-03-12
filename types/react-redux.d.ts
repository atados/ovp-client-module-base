import reactRexux from 'react-redux'
import { ReduxState } from '~/redux/root-reducer'

declare module 'react-redux' {
  export interface DefaultReduxState extends ReduxState {}
}
