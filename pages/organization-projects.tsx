import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { ReduxState } from '../redux/root-reducer'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import Meta from '~/components/Meta'
import { OrganizationPageLayout } from '~/components/OrganizationPage'
import { getOrganizationPageInitialProps } from '~/components/OrganizationPage/organization-page-utils'
import { FormattedMessage } from 'react-intl'
import { ApiPagination } from '../redux/ducks/search'
import { Project } from '../redux/ducks/project'
import useFetchAPI from '../hooks/use-fetch-api'
import ProjectCard from '../components/ProjectCard'
import { isQueryReady } from '../lib/apollo'
import ActivityIndicator from '../components/ActivityIndicator'
import { Color } from '../common'
import { Waypoint } from 'react-waypoint'
import useFetchAPIMutation from '../hooks/use-fetch-api-mutation'
import { useFetchClient } from 'react-fetch-json-hook'

interface OrganizationProjectsPageProps {
  readonly organizationSlug: string
}

const OrganizationProjectsPage: NextPage<OrganizationProjectsPageProps> = ({
  organizationSlug,
}) => {
  const [organization, isViewerMember] = useSelector(
    (reduxState: ReduxState) => {
      if (reduxState.organization.slug === organizationSlug) {
        const viewer = reduxState.user
        const organizationNode = reduxState.organization.node
        return [
          organizationNode,
          Boolean(
            viewer &&
              organizationNode &&
              viewer.organizations.some(o => o.slug === organizationNode.slug),
          ),
        ]
      }

      return [undefined, false]
    },
  )
  const fetchClient = useFetchClient()
  const projectsQuery = useFetchAPI<ApiPagination<Project>>(
    `/search/projects/?organization=${organization &&
      organization.id}&ordering=-published,-published_date,-created_date,closed&page_size=8&published=${
      organization && isViewerMember ? 'both' : 'true'
    }&closed=both`,
    {
      id: 'organization-projects',
      skip: !organization,
    },
  )
  const fetchMoreProjectsMutation = useFetchAPIMutation<ApiPagination<Project>>(
    (nextURL: string) => ({
      endpoint: nextURL.substr(nextURL.indexOf('/search') - 7),
    }),
  )
  const projects = projectsQuery.data?.results || []
  const handleLoadMore = async () => {
    const prevResult = projectsQuery.data

    if (prevResult?.next && prevResult) {
      const { data: nextResult } = await fetchMoreProjectsMutation.mutate(
        prevResult.next,
      )

      if (!nextResult) {
        return
      }

      fetchClient.set('manageable-projects', {
        ...prevResult,
        next: nextResult.next,
        results: [...prevResult.results, ...nextResult.results],
      })
    }
  }

  const meta = organization && (
    <Meta
      title={organization.name}
      description={organization.description}
      image={organization.image && organization.image.image_url}
    />
  )

  return (
    <OrganizationLayout
      className="bg-gray-100"
      organization={organization}
      isViewerMember={isViewerMember}
    >
      {meta}
      {organization && (
        <OrganizationPageLayout
          organization={organization}
          isViewerMember={isViewerMember}
        >
          <div className="container px-2 py-5">
            <div className="bg-white shadow rounded-lg p-4">
              {isQueryReady(projectsQuery) && (
                <div className="float-right text-gray-500">
                  <FormattedMessage
                    id="pages.organizationProjects.count"
                    defaultMessage="{value} vagas de voluntariado"
                    values={{ value: projectsQuery.data?.count || 0 }}
                  />
                </div>
              )}
              <h3 className="text-xl font-medium mb-6">
                <FormattedMessage
                  id="pages.organizationProjects.title"
                  defaultMessage="Vagas de voluntariado"
                />
              </h3>
              <div className="flex flex-wrap -mx-2">
                {projects.map(p => (
                  <div className="px-2 w-full md:w-1/3 lg:w-1/4">
                    <ProjectCard key={p.slug} {...p} className="mb-6" />
                  </div>
                ))}
              </div>
              {projectsQuery.loading && (
                <div className="p-5 text-center">
                  <ActivityIndicator size={48} fill={Color.gray[500]} />
                </div>
              )}
              {!projectsQuery.loading && <Waypoint onEnter={handleLoadMore} />}
            </div>
          </div>
        </OrganizationPageLayout>
      )}
    </OrganizationLayout>
  )
}

OrganizationProjectsPage.displayName = 'OrganizationPage'
OrganizationProjectsPage.getInitialProps = getOrganizationPageInitialProps

export default OrganizationProjectsPage
