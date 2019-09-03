import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Page } from '~/base/common'
import { colors } from '~/common/constants'
import { OrganizationAppliesPayload } from '~/redux/ducks/organization-applies'
import { RootState } from '~/redux/root-reducer'

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

const OrganizationApplies: React.FC<OrganizationAppliesProps> = ({
  fetching,
  payload,
}) => {
  if (fetching) {
    return null
  }

  if (!payload) {
    return null
  }

  return (
    <div className="bg-muted radius-10 mb-3 p-3">
      {fetching}
      <h4 className="ts-normal mb-0">Voluntários</h4>
      <span className="tc-muted mb-2 ts-small block">
        {payload.applied_count} voluntários
      </span>
      {payload.applies.map((application, i) => {
        if (!application.user) {
          return (
            <Volunteer
              as="span"
              key={application.id}
              className="bg-cover"
              style={{
                backgroundColor: colors[i % colors.length],
              }}
            />
          )
        }

        return (
          <Link
            key={application.id}
            href={{
              pathname: Page.PublicUser,
              query: { slug: application.user.slug },
            }}
            as={`/voluntario/${application.user.slug}`}
          >
            <Volunteer
              key={application.id}
              href={`/voluntario/${application.user.slug}`}
              className="bg-cover"
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
