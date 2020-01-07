import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Page, PageAs } from '~/base/common'
import { colors } from '~/common/constants'
import { OrganizationAppliesPayload } from '~/redux/ducks/organization-applies'
import { RootState } from '~/redux/root-reducer'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

const Volunteer = styled.a`
  display: inline-block;
  margin: 1px 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

interface OrganizationAppliesProps {
  readonly className?: string
  readonly fetching?: boolean
  readonly payload?: OrganizationAppliesPayload
}

const { VOLUNTARIOS } = defineMessages({
  VOLUNTARIOS: {
    id: 'VOLUNTARIOS',
    defaultMessage: 'Voluntários',
  },
})

const OrganizationApplies: React.FC<OrganizationAppliesProps> = ({
  fetching,
  payload,
}) => {
  const intl = useIntl()

  if (fetching) {
    return null
  }

  if (!payload) {
    return null
  }

  return (
    <div className="bg-muted rounded-lg mb-4 p-3">
      {fetching}
      <h4 className="text-base mb-0">{intl.formatMessage(VOLUNTARIOS)}</h4>
      <span className="text-gray-600 mb-2 text-sm block">
        {payload.applied_count} {intl.formatMessage(VOLUNTARIOS)}
      </span>
      {payload.applies.map((application, i) => {
        if (!application.user) {
          return (
            <Volunteer
              as="span"
              key={application.id}
              className="bg-cover bg-center"
              style={{
                backgroundColor: colors[i % colors.length],
              }}
            />
          )
        }

        return (
          <Link
            key={application.id}
            href={Page.PublicUser}
            as={PageAs.PublicUser({ slug: application.user.slug })}
            passHref
          >
            <Volunteer
              key={application.id}
              className="bg-cover bg-center"
              style={{
                backgroundColor: colors[i % colors.length],
                backgroundImage:
                  application.user && application.user.avatar
                    ? `url('${application.user.avatar.image_small_url}')`
                    : undefined,
              }}
            />
          </Link>
        )
      })}
    </div>
  )
}

OrganizationApplies.displayName = 'OrganizationApplies'

const mapStateToProps = ({
  organizationApplies,
}: RootState): Partial<OrganizationAppliesProps> => ({
  fetching: organizationApplies.fetching,
  payload: organizationApplies.payload,
})

export default connect(mapStateToProps)(OrganizationApplies)
