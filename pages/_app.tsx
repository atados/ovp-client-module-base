import * as Sentry from '@sentry/browser'
import moment from 'moment'
import NextApp, { AppComponentProps, Container } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import React from 'react'
import { addLocaleData, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { channel, dev } from '~/common/constants'
import {
  generateButtonCSS,
  generateButtonOutlineCSS,
  generateTextButtonCSS,
} from '~/components/Button/mixins'
import IntlContextProvider from '~/components/IntlContextProvider'
import { ModalProvider } from '~/components/Modal'
import ProgressBar from '~/components/ProgressBar'
import { StatusProvider } from '~/components/Status'
import GTMScripts from '~/components/TagManager/GTMScripts'
import withApollo from '~/lib/apollo/with-apollo'
import { rgba } from '~/lib/color/transformers'
import { setupDataLayer } from '~/lib/tag-manager'
import { RootState } from '~/redux/root-reducer'
import withRedux from '~/redux/with-redux'

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any }
    ReactIntlLocaleData: { [lang: string]: ReactIntl.Locale }
  }
}

// Only run Sentry on production
if (!dev) {
  Sentry.init({
    dsn: 'https://96b61952137240d98f0086f071ae54e1@sentry.io/1329517',
  })
}

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach(lang => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

const GlobalProgressBar = styled(ProgressBar)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9000;
`

interface AppProps extends AppComponentProps {
  readonly store: Store<RootState>
  readonly channelPages: string[]
}

const css = `
  .p-toolbar {
    padding-top: ${channel.theme.toolbarHeight}px;
  }

  .bg-primary {
    background: ${channel.theme.colorPrimary};
  }

  .bg-outline-primary {
    border-color: ${channel.theme.colorPrimary};
    background: ${rgba(channel.theme.colorPrimary, 15)}
  }

  .input:focus {
    border-color: ${channel.theme.colorPrimary}
  }

  .tc-primary,
  .hover\\:text-primary:hover {
    color: ${channel.theme.colorPrimary} !important;
  }

  .checkbox-indicator:focus {
    border-color: ${channel.theme.colorPrimary};
    box-shadow: 0 0 8px ${channel.theme.colorPrimary};
  }

  input:checked + .checkbox-indicator {
    background-color: ${channel.theme.colorPrimary};
    border-color: ${channel.theme.colorPrimary};
  }

  .tc-secondary,
  .tc-secondary:hover,
  .tc-secondary:focus {
    color: ${channel.theme.colorSecondary}
  }

  .bg-primary-hover:hover {
    background: ${channel.theme.colorPrimary};
  }

  ${generateButtonCSS(['.btn-secondary'], channel.theme.colorSecondary)}


  ${generateButtonCSS(
    ['.btn-primary', '.btn-apply'],
    channel.theme.primaryButtonBackground || channel.theme.colorPrimary,
  )}

  ${generateButtonOutlineCSS(
    ['.btn-outline-primary'],
    channel.theme.primaryButtonBackground || channel.theme.colorPrimary,
  )}

  ${generateButtonOutlineCSS(
    ['.btn-outline-secondary'],
    channel.theme.colorSecondary,
  )}

  ${generateTextButtonCSS(['.btn-text-primary'], channel.theme.colorPrimary)}
`

class App extends NextApp<AppProps> {
  public progressBar: ProgressBar | null

  public componentWillMount() {
    const { intl } = this.props.store.getState()

    moment.locale(intl.locale)
  }

  public componentDidMount() {
    if (this.progressBar) {
      Router.onRouteChangeStart = this.progressBar.start
      Router.onRouteChangeComplete = this.progressBar.done
      Router.onRouteChangeError = this.progressBar.done
    }

    if (channel.config.googleTagManager) {
      setupDataLayer(channel.config.googleTagManager.id)
    }
  }

  public render() {
    const { Component, store, pageProps } = this.props
    const {
      intl: { locale, messages },
    } = store.getState()
    const now = Date.now()

    return (
      <Container>
        <IntlProvider locale={locale} messages={messages} initialNow={now}>
          <IntlContextProvider>
            <Provider store={store}>
              <ThemeProvider theme={channel.theme}>
                <StatusProvider>
                  <ModalProvider>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: css,
                      }}
                    />
                    <Head>
                      <meta
                        name="theme-color"
                        content={channel.theme.colorPrimary}
                      />
                      {channel.config.maps.key && (
                        <script
                          src={`https://maps.googleapis.com/maps/api/js?key=${
                            channel.config.maps.key
                          }&libraries=places&language=pt-Br`}
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
          </IntlContextProvider>
        </IntlProvider>
      </Container>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  authToken: user ? user.name : null,
})
export default withApollo(withRedux(mapStateToProps)(App as any))
