import { NextFC } from 'next'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import Icon from '~/components/Icon'
import InviteMember from '~/components/InviteMember'
import { useModal } from '~/components/Modal'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import useFetchAPI from '~/hooks/use-fetch-api'
import { NotFoundPageError } from '~/lib/next/errors'
import { User, UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { OrganizationMember } from '~/types/api'

const Page = styled.div`
  min-height: 100vh;
`

const Card = styled.div`
  border-radius: 10px 10px 0 0;
  /* min-height: calc (full_height - toolbar_height - nav_height - margin_top) */
  min-height: calc(100vh - ${channel.theme.toolbarHeight}px - 50px - 20px);
  border-bottom-width: 0;
  margin-top: 20px;
`

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

const OrganizationMembersPage: NextFC<
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
    <Page className="bg-muted">
      <OrganizationLayout
        layoutProps={{ disableFooter: true }}
        isCurrentUserMember
        organization={organization}
      >
        <div className="container">
          <Card className="card">
            <div className="p-4">
              <h4 className="tw-normal mb-1">Membros da ONG</h4>
              <p className="tc-muted mb-0">
                Gerencie os membros que podem administrar o perfil da ONG.
              </p>
            </div>
            <TableWrapper>
              <Table className="table table-default borderless">
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td className="pl-4">
                        <Link
                          href={{
                            pathname: resolvePage('/public-user'),
                            query: { slug: member.slug },
                          }}
                          as={`/voluntarios/${member.slug}`}
                        >
                          <a className="tc-base">
                            <div
                              className="w-32 h-32 bg-cover rounded mr-3 d-inline-block vertical-align-middle"
                              style={
                                member.avatar
                                  ? {
                                      backgroundImage: `url('${
                                        member.avatar.image_url
                                      }')`,
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
                            Remover acesso
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
                Adicionar membro
              </button>
            </div>
          </Card>
        </div>
      </OrganizationLayout>
    </Page>
  )
}

OrganizationMembersPage.displayName = 'OrganizationMembersPage'
OrganizationMembersPage.getInitialProps = ({ store, query }) => {
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
