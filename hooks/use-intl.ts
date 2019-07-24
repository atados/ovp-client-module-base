import { useContext } from 'react'
import { InjectedIntl } from 'react-intl'
import { IntlContext } from '~/components/IntlContextProvider'

export default function useIntl(): InjectedIntl {
  const intl = useContext(IntlContext)

  if (!intl) {
    return {} as InjectedIntl
  }

  return intl
}
