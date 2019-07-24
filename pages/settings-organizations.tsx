import { NextContext, NextStatelessComponent } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import Meta from '~/components/Meta'
import PublicUserLayout from '~/components/PublicUserLayout'
import { getPublicUserLayoutInitialProps } from '~/components/PublicUserLayout/PublicUserLayout'
import UserSettingsNav from '~/components/UserSettings/UserSettingsNav'
import { NotFoundPageError } from '~/lib/next/errors'
import { PublicUser } from '~/redux/ducks/public-user'
import { User } from '~/redux/ducks/user'
import { UserOverrides } from '~/redux/ducks/user-update'
import { RootState } from '~/redux/root-reducer'

const Avatar = styled.span`
  width: 32px;
  height: 32px;
  margin-right: 12px;
  vertical-align: middle;
`

interface SettingsOrganizationsProps {
  readonly publicUser?: PublicUser
  readonly currentUser?: User
  readonly onSubmit: (values: UserOverrides) => any
  readonly causesSelectItems: InputSelectItem[]
  readonly skillsSelectItems: InputSelectItem[]
}

const SettingsOrganizations: NextStatelessComponent<
  SettingsOrganizationsProps,
  {}
> = ({ currentUser }) => {
  if (!currentUser) {
    return <PublicUserLayout />
  }

  return (
    <PublicUserLayout sidebar={<UserSettingsNav />}>
      <Meta title={currentUser.name} />
      <Link
        href={{
          pathname: resolvePage('/organization-composer'),
        }}
        as="/sou-uma-ong"
      >
        <a className="float-right btn btn-default btn--size-2">Nova ONG</a>
      </Link>
      <h4 className="tw-normal mb-0 mb-4">ONGs que você é responsável</h4>
      <div className="card">
        {currentUser.organizations.map(organization => (
          <div key={organization.slug} className="d-flex card-item px-2 py-3">
            <Link
              href={{
                pathname: resolvePage('/organization'),
                query: { slug: organization.slug },
              }}
              as={`/ong/${organization.slug}`}
            >
              <a className="tw-medium">
                <Avatar
                  className="avatar"
                  style={
                    organization.image
                      ? {
                          backgroundImage: `url('${
                            organization.image.image_small_url
                          }')`,
                        }
                      : undefined
                  }
                />
                {organization.name}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </PublicUserLayout>
  )
}

SettingsOrganizations.displayName = 'SettingsOrganizations'
SettingsOrganizations.getInitialProps = async (context: NextContext) => {
  const { user: currentUser } = context.store.getState()
  context.query.slug = currentUser ? currentUser.slug : context.query.slug

  if (!currentUser) {
    throw new NotFoundPageError()
  }

  await getPublicUserLayoutInitialProps(context)

  return {}
}
const mapStateToProps = ({ user }: RootState) => ({
  currentUser: user,
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsOrganizations)
