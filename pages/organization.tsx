import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import Meta from '~/components/Meta'
import {
  OrganizationPageLayout,
  OrganizationPageDetails,
  OrganizationPageProjects,
  OrganizationPagePhotos,
} from '~/components/OrganizationPage'
import { getOrganizationPageInitialProps } from '~/components/OrganizationPage/organization-page-utils'

interface OrganizationPageProps {
  readonly organizationSlug: string
}

const OrganizationPage: NextPage<OrganizationPageProps> = ({
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

  const meta = organization && (
    <Meta
      title={organization.name}
      description={organization.description}
      image={organization.image && organization.image.image_url}
    />
  )
  const children = organization && (
    <OrganizationPageLayout organization={organization}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-7">
            <OrganizationPageProjects
              organization={organization}
              itemClassName="px-3"
            />
          </div>
          <div className="col-md-5 hidden md:block">
            <OrganizationPagePhotos
              organization={organization}
              className="mb-3"
              isViewerMember={isViewerMember}
            />
            <OrganizationPageDetails organization={organization} />
          </div>
        </div>
      </div>
    </OrganizationPageLayout>
  )

  return (
    <OrganizationLayout
      className="bg-gray-100"
      organization={organization}
      isViewerMember={isViewerMember}
    >
      {meta}
      {children}
    </OrganizationLayout>
  )
}

OrganizationPage.displayName = 'OrganizationPage'
OrganizationPage.getInitialProps = getOrganizationPageInitialProps

export default OrganizationPage
