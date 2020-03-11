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
import { mountAddressFilter } from '~/lib/utils/geo-location'
import ActivityIndicator from '~/components/ActivityIndicator'
import { APIEndpoint } from '~/common'
import useSWR from 'swr'

const HomePage: React.FC = () => {
  const geo = useSelector((state: RootState) => state.geo)
  const catalogueQuery = useSWR<Catalogue>(
    APIEndpoint.Catalogue('home', { address: mountAddressFilter(geo) }),
  )
  const sections = catalogueQuery.data?.sections || []

  return (
    <Layout className="p-toolbar" toolbarProps={{ flat: true, fixed: true }}>
      <Meta />
      <Banner />
      <div>
        <div className="container pt-8 px-2">
          {catalogueQuery.isValidating && (
            <div className="text-center mb-4">
              <ActivityIndicator size={100} className="m-0" />
              <span className="block text-gray-700 text-2xl">
                Carregando vagas...
              </span>
            </div>
          )}
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
    </Layout>
  )
}

HomePage.displayName = 'HomePage'

export default HomePage
