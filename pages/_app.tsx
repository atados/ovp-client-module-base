import moment from 'moment'
import nextCookies from 'next-cookies'
import NextApp, { AppProps as NextAppProps, AppContext } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { ModalProvider } from '~/components/Modal'
import ProgressBar from '~/components/ProgressBar'
import { StatusProvider } from '~/components/Status'
import GTMScripts from '~/components/TagManager/GTMScripts'
import { withFetch } from '~/lib/apollo/with-fetch'
import { setupDataLayer } from '~/lib/tag-manager'
import { RootState } from '~/redux/root-reducer'
import withRedux from '~/redux/with-redux'
import { getStartupData } from '../lib/startup'
import { loginWithSessionToken, logout } from '../redux/ducks/user'
import { Asset, Config, Theme } from '~/common'
import {
  setupErrorMonitoring,
  setSentryUser,
  reportError,
} from '../lib/utils/error'
import { createGeolocationObject } from '../lib/geo'
import ToastsProvider from '~/components/Toasts/ToastsProvider'

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any }
  }
}

setupErrorMonitoring()

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
// if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
//   Object.keys(window.ReactIntlLocaleData).forEach(lang => {
//     addLocaleData(window.ReactIntlLocaleData[lang])
//   })
// }

const GlobalProgressBar = styled(ProgressBar)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9000;
`

interface AppProps extends NextAppProps {
  readonly store: Store<RootState>
  readonly channelPages: string[]
}

// const intlHash = Date.now()
class App extends NextApp<AppProps> {
  public static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {}

    const { sessionToken } = nextCookies(ctx)
    const { startup, user } = ctx.store.getState() as RootState

    if (sessionToken && !user) {
      try {
        await ctx.store.dispatch(loginWithSessionToken(sessionToken, '@app'))
      } catch (error) {
        reportError(error)
        await ctx.store.dispatch(logout())
      }
    }

    if (!startup) {
      ctx.store.dispatch({
        type: 'STARTUP',
        payload: await getStartupData(),
      })
    }

    if (ctx.req) {
      ctx.store.dispatch({
        type: 'GEO',
        payload: await createGeolocationObject(ctx.req),
      })
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  public progressBar: ProgressBar | null = null

  public componentWillMount() {
    const { intl, user } = this.props.store.getState()
    setSentryUser(user)

    moment.locale(intl!.locale)
  }

  public componentDidMount() {
    if (this.progressBar && Router) {
      Router.events.on('routeChangeStart', this.progressBar.start)
      Router.events.on('routeChangeComplete', this.progressBar.done)
      Router.events.on('routeChangeError', this.progressBar.done)
    }

    if (Config.googleTagManager) {
      setupDataLayer(Config.googleTagManager.id)
    }
  }

  public render() {
    const { Component, store, pageProps } = this.props
    const reduxState = store.getState() as RootState
    const intl = reduxState.intl!

    return (
      <IntlProvider
        locale={intl.locale}
        defaultLocale="pt-br"
        messages={intl.messages}
      >
        <Provider store={store}>
          <ThemeProvider theme={Theme}>
            <ToastsProvider>
              <StatusProvider>
                <ModalProvider>
                  <Head>
                    <meta
                      name="theme-color"
                      content={Theme.color.primary[500]}
                    />
                    {/* <script src={`/api/intl/${intlHash}/${intl.locale}`} /> */}
                    {Config.maps.key && (
                      <script
                        src={`https://maps.googleapis.com/maps/api/js?key=${Config.maps.key}&libraries=places&language=${intl.locale}`}
                      />
                    )}
                    {Asset.Favicon && (
                      <link
                        rel="shortcut icon"
                        href={Asset.Favicon}
                        type="image/x-icon"
                      />
                    )}
                    {Config.head.scripts.map((script, i) => (
                      <script key={i} {...script} />
                    ))}
                    {Config.head.links.map((link, i) => (
                      <link key={i} {...link} />
                    ))}
                  </Head>

                  {Config.googleTagManager && (
                    <GTMScripts {...Config.googleTagManager} />
                  )}
                  <GlobalProgressBar
                    ref={ref => {
                      this.progressBar = ref as ProgressBar
                    }}
                  />
                  <Component {...pageProps} />
                </ModalProvider>
              </StatusProvider>
            </ToastsProvider>
          </ThemeProvider>
        </Provider>
      </IntlProvider>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  authToken: user ? user.name : null,
})
export default withFetch(withRedux(mapStateToProps)(App as any))
