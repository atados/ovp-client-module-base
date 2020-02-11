import React from 'react'
import CatalogueSection from '~/components/Catalogue/CatalogueSection'
import CausesSection from '~/components/CausesSection'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import { Catalogue } from '~/redux/ducks/catalogue'
import Banner from '~/pages/home/Banner'
import { useSelector } from 'react-redux'
import { RootState } from '~/redux/root-reducer'
import { Endpoint } from '~/lib/api/endpoints'
import { mountAddressFilter } from '~/lib/utils/geo-location'

const HomePage: React.FC = () => {
  const geo = useSelector((state: RootState) => state.geo)
  const catalogueQuery = useFetchAPI<Catalogue>(
    Endpoint.Catalogue({
      slug: 'home',
      filterByAddress: mountAddressFilter(geo),
    }),
  )
  const sections = catalogueQuery.data?.sections || []

  const body = !catalogueQuery.loading && (
    <div>
      <div className="container pt-8 px-2">
        {sections[0] && (
          <CatalogueSection section={sections[0]} className="mb-6" />
        )}
        <CausesSection className="mb-6" />
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
      <Banner />
      {body}
    </Layout>
  )
}

HomePage.displayName = 'HomePage'

export default HomePage
