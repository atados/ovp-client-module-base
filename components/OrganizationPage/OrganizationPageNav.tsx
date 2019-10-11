import React from 'react'
import { Organization } from '~/base/redux/ducks/organization'
import VolunteerIcon from '../Icon/VolunteerIcon'
import PageLink from '../PageLink'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { Page } from '~/base/common'
import { useModal } from '../Modal'
import OrganizationAvailableProjects from '~/components/OrganizationAvailableProjects'

interface OrganizationPageNavProps {
  readonly className?: string
  readonly organization: Organization
}

const OrganizationPageNav: React.FC<OrganizationPageNavProps> = ({
  className,
  organization,
}) => {
  const router = useRouter()
  const openAvailableProjectsModal = useModal({
    id: 'OrganizationAvailableProjects',
    component: OrganizationAvailableProjects,
  })

  const buttons = (
    <>
      <button
        type="button"
        className="btn btn-primary btn--size-3"
        onClick={() => openAvailableProjectsModal()}
      >
        <VolunteerIcon width={18} height={16} fill="#fff" className="mr-1" />
        <FormattedMessage
          id="organizationPageNav.apply"
          defaultMessage="Quero ser voluntário"
        />
      </button>
    </>
  )
  return (
    <div className={className}>
      <div className="md:hidden mb-3">{buttons}</div>
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
        <div className="mr-auto"></div>
        <div className="hidden md:block py-1">{buttons}</div>
      </div>
    </div>
  )
}

OrganizationPageNav.displayName = 'OrganizationPageNav'

export default OrganizationPageNav
