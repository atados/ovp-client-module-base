import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import Meta from '~/components/Meta'
import {
  OrganizationPageLayout,
  OrganizationPageDetails,
  OrganizationPageAbout,
  OrganizationPageProjects,
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
    <OrganizationPageLayout
      organization={organization}
      isViewerMember={isViewerMember}
    >
      <div className="container px-2 py-5">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-7/12 px-2">
            <OrganizationPageProjects
              organization={organization}
              itemClassName="px-4"
            />
          </div>
          <div className="w-full md:w-5/12 hidden md:block px-2">
            <OrganizationPageDetails
              organization={organization}
              className="mb-6"
            />
            <OrganizationPageAbout organization={organization} />
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
