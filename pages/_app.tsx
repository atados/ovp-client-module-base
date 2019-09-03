import '../../channel/generated/styles/index.css'
import '../../channel/generated/styles/channel.css'

import * as Sentry from '@sentry/browser'
import moment from 'moment'
import nextCookies from 'next-cookies'
import { AppContextType } from 'next-server/dist/lib/utils'
import NextApp, { AppProps as NextAppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { channel, dev } from '~/common/constants'
import { ModalProvider } from '~/components/Modal'
import ProgressBar from '~/components/ProgressBar'
import { StatusProvider } from '~/components/Status'
import GTMScripts from '~/components/TagManager/GTMScripts'
import withApollo from '~/lib/apollo/with-apollo'
import { setupDataLayer } from '~/lib/tag-manager'
import { RootState } from '~/redux/root-reducer'
import withRedux from '~/redux/with-redux'
import { getStartupData } from '../lib/startup'
import { loginWithSessionToken } from '../redux/ducks/user'

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any }
  }
}

// Only run Sentry on production
if (!dev && channel.config.sentry) {
  Sentry.init(channel.config.sentry)
}

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

const intlHash = Date.now()
class App extends NextApp<AppProps> {
  public static async getInitialProps({ Component, ctx }: AppContextType) {
    let pageProps = {}

    const { sessionToken } = nextCookies(ctx)
    const { startup, user } = ctx.store.getState() as RootState

    if (sessionToken && !user) {
      await ctx.store.dispatch(loginWithSessionToken(sessionToken))
    }

    if (!startup) {
      ctx.store.dispatch({
        type: 'STARTUP',
        payload: await getStartupData(),
      })
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  public progressBar: ProgressBar | null = null

  public componentWillMount() {
    const { intl } = this.props.store.getState()

    moment.locale(intl!.locale)
  }

  public componentDidMount() {
    if (this.progressBar && Router) {
      Router.events.on('routeChangeStart', this.progressBar.start)
      Router.events.on('routeChangeComplete', this.progressBar.done)
      Router.events.on('routeChangeError', this.progressBar.done)
    }

    if (channel.config.googleTagManager) {
      setupDataLayer(channel.config.googleTagManager.id)
    }
  }

  public render() {
    const { Component, store, pageProps } = this.props
    const reduxState = store.getState() as RootState
    const intl = reduxState.intl!

    return (
      <IntlProvider locale={intl.locale} messages={intl.messages}>
        <Provider store={store}>
          <ThemeProvider theme={channel.theme}>
            <StatusProvider>
              <ModalProvider>
                <Head>
                  <meta
                    name="theme-color"
                    content={channel.theme.color.primary[500]}
                  />
                  <script src={`/api/intl/${intlHash}/${intl.locale}`} />
                  {channel.config.maps.key && (
                    <script
                      src={`https://maps.googleapis.com/maps/api/js?key=${channel.config.maps.key}&libraries=places&language=pt-Br`}
                    />
                  )}
                  {channel.assets.icon && (
                    <link
                      rel="shortcut icon"
                      href={channel.assets.icon}
                      type="image/x-icon"
                    />
                  )}
                  {channel.assets.scripts &&
                    channel.assets.scripts.map((script, i) => (
                      <script key={i} {...script} />
                    ))}
                  {channel.assets.links &&
                    channel.assets.links.map((link, i) => (
                      <link key={i} {...link} />
                    ))}
                </Head>

                {channel.config.googleTagManager && (
                  <GTMScripts {...channel.config.googleTagManager} />
                )}
                <GlobalProgressBar
                  ref={ref => {
                    this.progressBar = ref as ProgressBar
                  }}
                />
                <Component {...pageProps} />
              </ModalProvider>
            </StatusProvider>
          </ThemeProvider>
        </Provider>
      </IntlProvider>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  authToken: user ? user.name : null,
})
export default withApollo(withRedux(mapStateToProps)(App as any))
