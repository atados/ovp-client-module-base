import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import InviteMember from '~/components/InviteMember'
import { useModal } from '~/components/Modal'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import useFetchAPI from '~/hooks/use-fetch-api'
import { NotFoundPageError } from '~/lib/next/errors'
import { UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { API } from '~/types/api'
import { Page, PageAs } from '../common'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import Meta from '../components/Meta'
import useFetchAPIMutation from '../hooks/use-fetch-api-mutation'
import ActivityIndicator from '~/components/ActivityIndicator'

const m = defineMessages({
  title: {
    id: 'pages.organizationMembers.title',
    defaultMessage: 'Membros da ONG',
  },
  areYouSure: {
    id: 'areYouSure',
    defaultMessage: 'Tem certeza?',
  },
})

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
  readonly organization: UserOrganization
}

const OrganizationMembersPage: NextPage<
  OrganizationMembersPageProps,
  OrganizationMembersPageInitialProps
> = ({ organization }) => {
  const intl = useIntl()
  const queryResult = useFetchAPI<API.OrganizationMember[]>(
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
  const [deletingMemberId, setDeletingMemberId] = useState<null | number>(null)
  const removeMemberMutation = useFetchAPIMutation(() => ({
    method: 'POST',
    endpoint: `/organizations/${organization.slug}/remove_member/`,
  }))
  const handleRemoveMember = (member: API.OrganizationMember) => {
    if (!confirm(intl.formatMessage(m.areYouSure))) {
      return
    }

    setDeletingMemberId(member.id)
    removeMemberMutation.mutate({ email: member.email })
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Meta title={intl.formatMessage(m.title)} />
      <OrganizationLayout
        layoutProps={{ disableFooter: true }}
        isViewerMember
        organization={organization}
      >
        <div className="container px-2 py-5">
          <div className="shadow bg-white rounded-lg">
            <div className="py-4 px-5">
              <h1 className="text-2xl font-medium">
                {intl.formatMessage(m.title)}
              </h1>
              <p className="text-gray-600 mb-0">
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
                      <td className="pl-5">
                        <Link
                          href={Page.PublicUser}
                          as={PageAs.PublicUser({ slug: member.slug })}
                        >
                          <a className="text-gray-800">
                            <div
                              className="w-8 h-8 bg-cover bg-center rounded mr-4 inline-block align-middle"
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
                      <td className="pr-5">{member.email}</td>
                      <td className="text-right">
                        {organization.owner &&
                          member.slug === organization.owner.slug && (
                            <button
                              type="button"
                              className="btn btn-muted btn--size-2 text-red-600"
                              onClick={() => handleRemoveMember(member)}
                              disabled={
                                removeMemberMutation.loading &&
                                deletingMemberId === member.id
                              }
                            >
                              <Icon name="close" className="mr-2" />
                              <FormattedMessage
                                id="pages.organizationMembers.removeMember"
                                defaultMessage="Remover membro"
                              />
                              {removeMemberMutation.loading &&
                                deletingMemberId === member.id && (
                                  <ActivityIndicator
                                    size={24}
                                    fill="#fff"
                                    className="ml-2"
                                  />
                                )}
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
    organization: state.user!.organizations.find(
      organization => organization.slug === organizationSlug,
    ),
  }),
)(OrganizationMembersPage)
