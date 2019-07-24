export interface IntlReducerState {
  readonly locale: string
  readonly messages: { [messageId: string]: string }
}

// @ts-ignore
export default (state: IntlReducerState = {}): IntlReducerState => state
