import accepts from 'accepts'
import NextDocument, {
  DocumentContext,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
// @ts-ignore
import generatedStyledFileName from '../../public/generated/css/filename.json'
import { Config } from '~/common'
import { AppIntl } from '~/lib/intl'

interface DocumentProps {
  readonly locale: string
  readonly styleTags: React.ReactNode
  readonly localeDataScript: string
}

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class Document extends NextDocument<DocumentProps> {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const page = ctx.renderPage((App: any) => props =>
      sheet.collectStyles(<App {...props} />),
    )
    const styleTags = sheet.getStyleElement()

    return {
      ...page,
      styleTags,
    }
  }

  public render() {
    return (
      <html lang={AppIntl.locale}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=1"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,500i,700"
            rel="stylesheet"
          />
          <link
            href={`/generated/css/${generatedStyledFileName}`}
            rel="stylesheet"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript,
            }}
          />
          <NextScript />
        </body>
      </html>
    )
  }
}
