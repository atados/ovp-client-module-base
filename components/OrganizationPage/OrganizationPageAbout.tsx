import React from 'react'
import cx from 'classnames'
import { Organization } from '~/base/redux/ducks/organization'
import removeMarkdown from 'remove-markdown'
import PageLink from '~/components/PageLink'
import { FormattedMessage } from 'react-intl'

interface OrganizationPageAboutProps {
  readonly className?: string
  readonly organization: Organization
}

const OrganizationPageAbout: React.FC<OrganizationPageAboutProps> = ({
  className,
  organization,
}) => {
  return (
    <div className={cx(className, 'bg-white p-3 rounded-lg shadow')}>
      <h4 className="text-lg font-medium mb-4">
        <FormattedMessage
          id="organizationPageAbout.title"
          defaultMessage="Sobre a ONG"
        />
      </h4>

      <p>{removeMarkdown(organization.details).substr(0, 200)}...</p>
      <PageLink
        href="OrganizationAbout"
        params={{ organizationSlug: organization.slug }}
      >
        <a className="btn bg-gray-200 py-3 text-gray-700 hover:bg-gray-300 btn--block">
          Ler mais
        </a>
      </PageLink>
    </div>
  )
}

OrganizationPageAbout.displayName = 'OrganizationPageAbout'

export default OrganizationPageAbout
