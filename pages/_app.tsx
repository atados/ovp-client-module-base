import NextApp, { AppProps as NextAppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'
import { Store } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { ModalProvider } from '~/components/Modal'
import ProgressBar from '~/components/ProgressBar'
import GTMScripts from '~/components/TagManager/GTMScripts'
import { setupDataLayer } from '~/lib/tag-manager'
import { ReduxState } from '~/redux/root-reducer'
import { Asset, Config, Theme, Color } from '~/common'
import { setupErrorMonitoring } from '../lib/utils/error'
import ToastsProvider from '~/components/Toasts/ToastsProvider'
import { SWRConfig } from 'swr'
import { swrFetcher } from '~/hooks/use-fetch'
import { withIntlProvider, AppIntl } from '~/lib/intl/with-intl-provider'
import { withRedux } from '~/redux/with-redux'

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
  readonly store: Store<ReduxState>
  readonly channelPages: string[]
}

class App extends NextApp<AppProps> {
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
    const { Component, pageProps } = this.props

    return (
      <ThemeProvider theme={Theme}>
        <SWRConfig
          value={{
            fetcher: swrFetcher,
            refreshInterval: 0,
            revalidateOnFocus: false,
          }}
        >
          <ToastsProvider>
            <ModalProvider>
              <Head>
                <meta name="theme-color" content={Theme.color.primary[500]} />
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
          </ToastsProvider>
        </SWRConfig>
      </ThemeProvider>
    )
  }
}

export default withIntlProvider(withRedux(App))
