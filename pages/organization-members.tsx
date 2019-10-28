import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import InviteMember from '~/components/InviteMember'
import { useModal } from '~/components/Modal'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import useFetchAPI from '~/hooks/use-fetch-api'
import { NotFoundPageError } from '~/lib/next/errors'
import { User, UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { OrganizationMember } from '~/types/api'
import { Page, PageAs } from '../common'
import { FormattedMessage } from 'react-intl'

const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Table = styled.table`
  max-width: 100%;
  min-width: 800px;
`

interface OrganizationMembersPageInitialProps {
  readonly organizationSlug: string
}

interface OrganizationMembersPageProps
  extends OrganizationMembersPageInitialProps {
  readonly viewer: User
  readonly organization: UserOrganization
}

const OrganizationMembersPage: NextPage<
  OrganizationMembersPageProps,
  OrganizationMembersPageInitialProps
> = ({ organization, viewer }) => {
  const queryResult = useFetchAPI<OrganizationMember[]>(
    `/organizations/${organization.slug}/members/`,
  )
  const openAddMemberModal = useModal({
    id: 'InviteMember',
    component: InviteMember,
    componentProps: {
      organizationSlug: organization.slug,
    },
    cardClassName: 'p-5',
  })
  const members = queryResult.data || []

  return (
    <div className="bg-muted">
      <OrganizationLayout
        layoutProps={{ disableFooter: true }}
        isViewerMember
        organization={organization}
      >
        <div className="container py-4">
          <div className="shadow bg-white rounded-lg">
            <div className="py-3 px-4">
              <h1 className="text-2xl tw-medium">
                <FormattedMessage
                  id="pages.organizationMembers.title"
                  defaultMessage="Membros da ONG"
                />
              </h1>
              <p className="tc-muted mb-0">
                <FormattedMessage
                  id="pages.organizationMembers.description"
                  defaultMessage="Gerencie os membros que podem administrar o perfil da ONG."
                />
              </p>
            </div>
            <TableWrapper>
              <Table className="table table-default borderless">
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td className="pl-4">
                        <Link
                          href={Page.PublicUser}
                          as={PageAs.PublicUser({ slug: member.slug })}
                        >
                          <a className="tc-base">
                            <div
                              className="w-8 h-8 bg-cover rounded mr-3 inline-block vertical-align-middle"
                              style={
                                member.avatar
                                  ? {
                                      backgroundImage: `url('${member.avatar.image_url}')`,
                                    }
                                  : { backgroundColor: '#ddd' }
                              }
                            />
                            {member.name}
                          </a>
                        </Link>
                      </td>
                      <td className="pr-4">{member.email}</td>
                      <td className="ta-right">
                        {member.slug !== viewer.slug && (
                          <button
                            type="button"
                            className="btn btn-muted btn--size-2 tc-error"
                          >
                            <Icon name="close" className="mr-2" />
                            <FormattedMessage
                              id="pages.organizationMembers.removeMember"
                              defaultMessage="Remover membro"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
            <div className="card-item p-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAddMemberModal()}
              >
                <Icon name="add" className="mr-2" />
                <FormattedMessage
                  id="pages.organizationMembers.add"
                  defaultMessage="Adicionar membro"
                />
              </button>
            </div>
          </div>
        </div>
      </OrganizationLayout>
    </div>
  )
}

OrganizationMembersPage.displayName = 'OrganizationMembersPage'
OrganizationMembersPage.getInitialProps = async ({ store, query }) => {
  const { user } = store.getState()
  const organizationSlug = query.organizationSlug
    ? String(query.organizationSlug)
    : undefined
  const organization: UserOrganization | undefined =
    user && organizationSlug
      ? user.organizations.find(
          organizationItem => organizationItem.slug === organizationSlug,
        )
      : undefined

  if (!organizationSlug || !organization) {
    throw new NotFoundPageError()
  }

  return {
    organizationSlug,
  }
}

export default connect(
  (
    state: RootState,
    { organizationSlug }: OrganizationMembersPageInitialProps,
  ) => ({
    viewer: state.user!,
    organization: state.user!.organizations.find(
      organization => organization.slug === organizationSlug,
    ),
  }),
)(OrganizationMembersPage)
