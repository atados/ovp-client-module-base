import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
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
import { fetchMoreProjects } from '../lib/utils/project'

interface OrganizationProjectsPageProps {
  readonly organizationSlug: string
}

const OrganizationProjectsPage: NextPage<OrganizationProjectsPageProps> = ({
  organizationSlug,
}) => {
  const [organization, isViewerMember] = useSelector(
    (reduxState: RootState) => {
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
  const projectsQuery = useFetchAPI<ApiPagination<Project>>(
    `/search/projects/?organization=${organization &&
      organization.id}&ordering=-published,-published_date,-created_date,closed&page_size=8&published=${
      organization && isViewerMember ? 'both' : 'true'
    }&closed=both`,
    {
      skip: !organization,
    },
  )
  const projects = (projectsQuery.data && projectsQuery.data.results) || []
  const handleLoadMore = () => projectsQuery.fetchMore(fetchMoreProjects)

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
        <OrganizationPageLayout organization={organization}>
          <div className="container py-4">
            <div className="bg-white shadow rounded-lg p-4">
              {isQueryReady(projectsQuery) && (
                <div className="float-right tc-gray-500">
                  {projectsQuery.data!.count} vagas de voluntariado
                </div>
              )}
              <h3 className="ts-large tw-normal mb-4">
                <FormattedMessage
                  id="pages.organizationProjects.title"
                  defaultMessage="Vagas de voluntariado"
                />
              </h3>
              <div className="row">
                {projects.map(p => (
                  <div className="col-md-4 col-lg-3">
                    <ProjectCard key={p.slug} {...p} className="mb-4" />
                  </div>
                ))}
              </div>
              {projectsQuery.loading && (
                <div className="p-5 ta-center">
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
