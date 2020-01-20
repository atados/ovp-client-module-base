import React from 'react'
import CatalogueSection from '~/components/Catalogue/CatalogueSection'
import CausesSection from '~/components/CausesSection'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import { useIntl } from 'react-intl'
import { Catalogue } from '~/redux/ducks/catalogue'
import { GlobalMessages } from '~/common'

const HomePage: React.FC = () => {
  const intl = useIntl()
  const catalogueQuery = useFetchAPI<Catalogue>('/catalogue/home/')
  const sections =
    catalogueQuery.data?.sections?.sort(
      (section1, section2) => section2.order - section1.order,
    ) || []

  const body = !catalogueQuery.loading && (
    <div>
      <div className="container pt-8">
        {sections[0] && (
          <CatalogueSection section={sections[0]} className="mb-6" />
        )}
        <CausesSection />
      </div>
      <div className="container px-2">
        {sections.slice(1).map((section, i) => (
          <CatalogueSection
            key={`${section.name}-${i}`}
            section={section}
            className={i !== sections.length - 2 ? 'mb-6' : undefined}
          />
        ))}
      </div>
    </div>
  )
  return (
    <Layout
      className="p-toolbar"
      toolbarProps={{ flat: true, fixed: true }}
      disableFooter={catalogueQuery.loading}
    >
      <Meta />
      <div className="bg-primary-500">
        <div className="container py-8">
          <h1 className="text-white">
            {intl.formatMessage(GlobalMessages.appName)}
          </h1>
          <p className="text-white-alpha-80 text-xl">
            {intl.formatMessage(GlobalMessages.appDescription)}
          </p>
        </div>
      </div>
      {body}
    </Layout>
  )
}

HomePage.displayName = 'HomePage'

export default HomePage
