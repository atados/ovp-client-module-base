import React from 'react'
import { Organization } from '~/base/redux/ducks/organization'
import PageLink from '../PageLink'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { Page } from '~/base/common'

interface OrganizationPageNavProps {
  readonly className?: string
  readonly organization: Organization
}

const OrganizationPageNav: React.FC<OrganizationPageNavProps> = ({
  className,
  organization,
}) => {
  const router = useRouter()

  return (
    <div className={className}>
      <div className="flex h-16 border-t border-gray-200">
        <div className="leading-loose flex flex-grow">
          <PageLink
            href="Organization"
            params={{ organizationSlug: organization.slug }}
          >
            <a
              className={`block py-3 px-2 ${
                router && router.pathname === Page.Organization
                  ? 'shadow-active tc-primary-500'
                  : 'tc-gray-700'
              }`}
            >
              <FormattedMessage
                id="organizationPageNav.home"
                defaultMessage="Página"
              />
            </a>
          </PageLink>
          <PageLink
            href="OrganizationAbout"
            params={{ organizationSlug: organization.slug }}
          >
            <a
              className={`block py-3 px-2 ${
                router && router.pathname === Page.OrganizationAbout
                  ? 'shadow-active tc-primary-500'
                  : 'tc-gray-700'
              }`}
            >
              <FormattedMessage
                id="organizationPageNav.about"
                defaultMessage="Sobre"
              />
            </a>
          </PageLink>
          <PageLink
            href="OrganizationProjects"
            params={{ organizationSlug: organization.slug }}
          >
            <a
              className={`block py-3 px-2 ${
                router && router.pathname === Page.OrganizationProjects
                  ? 'shadow-active tc-primary-500'
                  : 'tc-gray-700'
              }`}
            >
              <FormattedMessage
                id="organizationPageNav.projects"
                defaultMessage="Vagas de voluntariado"
              />
            </a>
          </PageLink>
        </div>
      </div>
    </div>
  )
}

OrganizationPageNav.displayName = 'OrganizationPageNav'

export default OrganizationPageNav
