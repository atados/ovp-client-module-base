import React from 'react'
import { Organization } from '~/redux/ducks/organization'
import {
  OrganizationPageHeader,
  OrganizationPageNav,
} from '~/components/OrganizationPage'

interface OrganizationPageLayoutProps {
  readonly organization: Organization
  readonly isViewerMember: boolean
  readonly className?: string
}

const OrganizationPageLayout: React.FC<OrganizationPageLayoutProps> = ({
  className,
  organization,
  isViewerMember,
  children,
}) => {
  return (
    <div className={className}>
      <div className="shadow-sm bg-white">
        <OrganizationPageHeader
          organization={organization}
          isViewerMember={isViewerMember}
          className="mb-4"
        />
        <div className="container">
          <OrganizationPageNav organization={organization} />
        </div>
      </div>
      {children}
    </div>
  )
}

OrganizationPageLayout.displayName = 'OrganizationPageLayout'

export default OrganizationPageLayout
