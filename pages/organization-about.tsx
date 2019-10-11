import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import Meta from '~/components/Meta'
import {
  OrganizationPageLayout,
  OrganizationPageDetails,
  OrganizationPagePhotos,
} from '~/components/OrganizationPage'
import { getOrganizationPageInitialProps } from '~/components/OrganizationPage/organization-page-utils'
import Markdown from '../components/Markdown'

interface OrganizationAboutPageProps {
  readonly organizationSlug: string
}

const OrganizationAboutPage: NextPage<OrganizationAboutPageProps> = ({
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
            <div className="row">
              <div className="col-md-7">
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="ts-medium tw-medium">Sobre ONG</h3>
                  <Markdown value={organization.details} />
                </div>
              </div>
              <div className="col-md-5 hidden md:block">
                <OrganizationPagePhotos
                  className="mb-4"
                  organization={organization}
                  isViewerMember={isViewerMember}
                />
                <OrganizationPageDetails organization={organization} />
              </div>
            </div>
          </div>
        </OrganizationPageLayout>
      )}
    </OrganizationLayout>
  )
}

OrganizationAboutPage.displayName = 'OrganizationPage'
OrganizationAboutPage.getInitialProps = getOrganizationPageInitialProps

export default OrganizationAboutPage
