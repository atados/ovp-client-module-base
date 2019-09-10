import { NextIntl } from 'next'

export type IntlReducerState = NextIntl | null
export interface InitIntlAction {
  type: 'INTL'
  payload: NextIntl
}

export default (
  intl: IntlReducerState = null,
  action: InitIntlAction,
): IntlReducerState => {
  if (action.type === 'INTL') {
    return action.payload!
  }

  return intl
}
