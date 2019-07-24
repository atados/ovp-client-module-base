import React from 'react'
import { defineMessages } from 'react-intl'
import CatalogueSection from '~/components/Catalogue/CatalogueSection'
import CausesSection from '~/components/CausesSection'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import useIntl from '~/hooks/use-intl'
import { Catalogue } from '~/redux/ducks/catalogue'

const messages = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel name',
  },
  appDescription: {
    id: 'app.description',
    defaultMessage: 'Channel description',
  },
})

const HomePage: React.FC = () => {
  const intl = useIntl()
  const catalogueQuery = useFetchAPI<Catalogue>('/catalogue/home/')
  const sections = (catalogueQuery.data && catalogueQuery.data.sections) || []
  return (
    <Layout className="p-toolbar" toolbarProps={{ flat: true, fixed: true }}>
      <Meta />
      <div className="bg-primary">
        <div className="container py-5">
          <h1 className="tc-white">{intl.formatMessage(messages.appName)}</h1>
          <p className="tc-light ts-large">
            {intl.formatMessage(messages.appDescription)}
          </p>
        </div>
      </div>
      <div className="container pt-5">
        {sections[0] && (
          <CatalogueSection section={sections[0]} className="mb-4" />
        )}
        <CausesSection />
      </div>
      <div className="container">
        {sections.slice(1).map((section, i) => (
          <CatalogueSection
            key={`${section.name}-${i}`}
            section={section}
            className={i !== sections.length - 2 ? 'mb-4' : undefined}
          />
        ))}
      </div>
    </Layout>
  )
}

HomePage.displayName = 'HomePage'

export default HomePage
