import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

export const IntlContext = React.createContext<InjectedIntl | null>(null)

const IntlContextProvider = injectIntl(({ intl, children }) => (
  <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>
))

IntlContextProvider.displayName = 'IntlContextProvider'

export default IntlContextProvider
