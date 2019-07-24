import { PayloadAction } from 'redux-handy'

export const throwActionError = <T>(action: PayloadAction<T>): T => {
  if (action.error) {
    throw action.payload
  }

  return action.payload as T
}
