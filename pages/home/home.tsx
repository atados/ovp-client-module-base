import React from 'react'
import CatalogueSection from '~/components/Catalogue/CatalogueSection'
import ActivityIndicator from '~/components/ActivityIndicator'
import CausesSection from '~/components/CausesSection'
import { Catalogue } from '~/redux/ducks/catalogue'
import { useFetch } from '~/hooks/use-fetch2'
import Layout from '~/components/Layout'
import Banner from '~/pages/home/Banner'
import { APIEndpoint } from '~/common'
import Meta from '~/components/Meta'

const HomePage: React.FC = () => {
  const catalogueQuery = useFetch<Catalogue>(APIEndpoint.Catalogue('home'))
  const sections =
    catalogueQuery.data?.sections?.filter(s => {
      if (s.type === 'organizations') {
        return !!s.organizations.length
      }
      if (s.type === 'projects') {
        return !!s.projects.length
      }
      return false
    }) || []

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
