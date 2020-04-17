import NextApp, { AppProps as NextAppProps, AppContext } from 'next/app'
import styled, { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import nextCookies from 'next-cookies'
import { Router } from 'next/router'
import { SWRConfig } from 'swr'
import { Store } from 'redux'
import Head from 'next/head'
import React from 'react'

import ToastsProvider from '~/components/Toasts/ToastsProvider'
import GTMScripts from '~/components/TagManager/GTMScripts'
import { Asset, Config, Theme, Color } from '~/common'
import { withIntlProvider, AppIntl } from '~/lib/intl'
import { StatusProvider } from '~/components/Status'
import { withFetch } from '~/lib/apollo/with-fetch'
import { ModalProvider } from '~/components/Modal'
import ProgressBar from '~/components/ProgressBar'
import { setupDataLayer } from '~/lib/tag-manager'
import { RootState } from '~/redux/root-reducer'
import { swrFetcher } from '~/hooks/use-swr'
import withRedux from '~/redux/with-redux'
import { dev } from '~/common/constants'

import { setupErrorMonitoring, reportError } from '../lib/utils/error'
import { loginWithSessionToken, logout } from '../redux/ducks/user'
import { createGeolocationObject } from '../lib/geo'
import { getStartupData } from '../lib/startup'

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any }
  }
}

setupErrorMonitoring()

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
      try {
        const geo = await createGeolocationObject(ctx.req)

        ctx.store.dispatch({
          type: 'GEO',
          payload: geo,
        })
      } catch (error) {
        // Use default geolocation
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  public progressBar: ProgressBar | null = null

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

    return (
      <Provider store={store}>
        <ThemeProvider theme={Theme}>
          <SWRConfig
            value={{
              fetcher: swrFetcher,
              refreshInterval: 0,
              revalidateOnFocus: false,
            }}
          >
            <ToastsProvider>
              <StatusProvider>
                <ModalProvider>
                  <Head>
                    <meta
                      name="theme-color"
                      content={Theme.color.primary[500]}
                    />
                    {Config.maps && (
                      <script
                        src={`https://maps.googleapis.com/maps/api/js?key=${Config.maps.key}&libraries=places&language=${AppIntl.locale}`}
                      />
                    )}
                    {Asset.favicon && (
                      <link
                        rel="shortcut icon"
                        href={Asset.favicon}
                        type="image/x-icon"
                      />
                    )}
                    {Config.head.scripts.map((script, i) => (
                      <script key={i} {...script} />
                    ))}
                    {Config.head.links.map((link, i) => (
                      <link key={i} {...link} />
                    ))}
                    <style>{`
                      .input:focus {
                        border-color: ${Color.primary[500]}
                      }

                      .checkbox-indicator:focus {
                        border-color: ${Color.primary[500]};
                        box-shadow: 0 0 8px ${Color.primary[500]};
                      }

                      input:checked + .checkbox-indicator {
                        background-color: ${Color.primary[500]};
                        border-color: ${Color.primary[500]};
                      }
                    `}</style>
                    {!dev && (
                      <script src={`/generated/lang/${AppIntl.locale}`} />
                    )}
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
          </SWRConfig>
        </ThemeProvider>
      </Provider>
    )
  }
}

export default withIntlProvider(withFetch(withRedux()(App as any)))
