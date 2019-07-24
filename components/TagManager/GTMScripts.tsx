import Head from 'next/head'
import React from 'react'

interface GTMScriptsProps {
  readonly id: string
}

const GTMScripts: React.FC<GTMScriptsProps> = ({ id }) => (
  <>
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${id}');`,
        }}
      />
    </Head>
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-NP5GCZB"
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  </>
)

GTMScripts.displayName = 'GTMScripts'

export default React.memo(GTMScripts)
