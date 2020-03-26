import { IntlProvider } from 'react-intl'
import Head from 'next/head'
import areIntlLocalesSupported from 'intl-locales-supported'
import moment from 'moment'

export const AppIntl: {
  locale: string
  messages: { [messageId: string]: string }
  localeData: any
} = JSON.parse(process.env.INTL_JSON!)

moment.locale(AppIntl.locale)

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported([AppIntl.locale])) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and patch the constructors we need with the polyfill's.
    const IntlPolyfill = require('intl/lib/core')
    Intl.NumberFormat = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
    IntlPolyfill.__disableRegExpRestore()
    IntlPolyfill.__addLocaleData(AppIntl.localeData)
  }
} else {
  // No `Intl`, so use and load the polyfill.
  const IntlPolyfill = require('intl/lib/core')
  // @ts-ignore
  global.IntlPolyfill = IntlPolyfill
  global.Intl = IntlPolyfill
  IntlPolyfill.__applyLocaleSensitivePrototypes()
  IntlPolyfill.__addLocaleData(AppIntl.localeData)
}

export function withIntlProvider<Props>(
  PageComponent: React.ComponentType<Props>,
) {
  const WithIntlProvider: React.FC<Props> = props => {
    return (
      <IntlProvider
        locale={AppIntl.locale}
        messages={AppIntl.messages}
        defaultLocale="pt-BR"
      >
        <Head>
          <script
            src={`https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${AppIntl.locale}`}
          />
        </Head>
        <PageComponent {...props} />
      </IntlProvider>
    )
  }

  // TODO: Remove this so _app can be static
  // @ts-ignore
  if (PageComponent.getInitialProps) {
    // @ts-ignore
    WithIntlProvider.getInitialProps = PageComponent.getInitialProps
  }

  return WithIntlProvider
}
