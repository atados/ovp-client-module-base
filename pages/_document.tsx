import NextDocument, {
  DocumentContext,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
// @ts-ignore
import generatedStyledFileName from '../../public/generated/css/filename.json'
import { AppIntl } from '~/lib/intl'

interface DocumentProps {
  readonly styleTags: React.ReactNode
}

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
          <NextScript />
        </body>
      </html>
    )
  }
}
