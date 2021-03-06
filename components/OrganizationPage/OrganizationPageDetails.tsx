import React from 'react'
import cx from 'classnames'
import { Organization } from '~/redux/ducks/organization'
import styled from 'styled-components'
import Icon from '../Icon'
import { Color } from '~/common'

const InfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding-left: 32px;
    color: ${Color.gray[700]};
    margin-bottom: 1rem;

    .icon {
      width: 24px;
      font-size: 20px;
      margin-left: -32px;
      float: left;
      color: ${Color.gray[800]};
    }
  }
`

interface OrganizationPageLastProjectsProps {
  readonly className?: string
  readonly organization: Organization
}

const OrganizationPageLastProjects: React.FC<OrganizationPageLastProjectsProps> = ({
  className,
  organization,
}) => {
  return (
    <div className={cx(className, 'bg-white p-3 rounded-lg shadow')}>
      <h4 className="text-lg font-medium mb-4">Contato</h4>
      <InfoList>
        {organization.address && !organization.hidden_address && (
          <li className="leading-tight">
            <Icon name="place" />
            <span className="block text-gray-600 font-medium text-xs mb-1 tt-upper">
              ENDEREÇO
            </span>
            <span className="ts-base text-gray-900">
              {organization.address.typed_address}
            </span>
          </li>
        )}
        <li className="leading-tight">
          <Icon name="email" />
          <span className="block text-gray-600 font-medium text-xs tt-upper mb-1">
            Email de contato
          </span>
          <span className="ts-basetext-gray-900 ">
            {organization.contact_email}
          </span>
        </li>
        {organization.website && (
          <li className="leading-tight">
            <Icon name="public" />
            <span className="block text-gray-600 font-medium text-xs tt-upper mb-1">
              Website
            </span>
            <a href={organization.website} className="text-gray-900 text-sm">
              {organization.website}
            </a>
          </li>
        )}
      </InfoList>
    </div>
  )
}

OrganizationPageLastProjects.displayName = 'OrganizationPageLastProjects'

export default OrganizationPageLastProjects
