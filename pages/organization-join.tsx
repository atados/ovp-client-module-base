import { NextContext } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import ActivityIndicator from '~/components/ActivityIndicator'
import ErrorMessage from '~/components/Form/ErrorMessage'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import { getOrganizationLayoutInitialProps } from '~/components/OrganizationLayout/OrganizationLayout'
import { NotFoundPageError } from '~/lib/next/errors'
import { Organization } from '~/redux/ducks/organization'
import { OrganizationMember } from '~/redux/ducks/organization-members'
import { joinOrganization } from '~/redux/ducks/organization-membership'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'

const Thumbnail = styled.figure`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background-color: #eee;
  display: block;
  margin: 0 auto;
`

interface OrganizationMembersPageProps {
  readonly userSlug: string
  readonly organization: Organization
  readonly nodes: OrganizationMember[]
  readonly currentUser: User
  readonly onSubmit: (organizationSlug: string) => void
  readonly isSubmitting?: boolean
  readonly failed?: boolean
  readonly joined?: boolean
}

class OrganizationMembersPage extends React.Component<
  OrganizationMembersPageProps
> {
  public static async getInitialProps(
    context: NextContext,
  ): Promise<{ userSlug: string }> {
    await getOrganizationLayoutInitialProps(context)

    const { user } = context.store.getState()

    if (
      !user ||
      !context.query.userSlug ||
      typeof context.query.userSlug !== 'string'
    ) {
      throw new NotFoundPageError()
    }

    return { userSlug: context.query.userSlug }
  }

  public submit = () => this.props.onSubmit(this.props.organization.slug)

  public render() {
    const {
      userSlug,
      currentUser,
      organization,
      joined,
      isSubmitting,
      failed,
    } = this.props

    return (
      <Layout>
        <div className="bg-muted py-8">
          <div className="container container--sm">
            <div className="card p-5 ta-center">
              <Thumbnail
                className="bg-cover mb-3"
                style={
                  organization.image
                    ? {
                        backgroundImage: `url('${
                          organization.image.image_url
                        }')`,
                      }
                    : undefined
                }
              />
              <h3>{organization.name}</h3>
              {userSlug !== currentUser.slug ? (
                <>
                  <p className="mb-3">
                    Você está conectado a uma conta que não é a conta convidada
                    para participar dessa ONG. Por favor, entre com a conta
                    referente ao email convidado.
                  </p>
                  <a
                    href={`/sair?next=/entrar?next=/ong/${
                      organization.slug
                    }/participar?user_slug=${userSlug}`}
                    className="btn btn--block btn--size-3 btn-primary"
                  >
                    Entrar com a conta correta
                    <Icon name="call_made" className="ml-2" />
                  </a>
                </>
              ) : (
                <p className="mb-3">
                  Você foi convidado para participar dessa ONG. Ao participar
                  você vai poder criar e gerenciar vagas e editar a ONG.
                </p>
              )}
              {userSlug !== currentUser.slug ? null : joined ? (
                <>
                  <h3 className="tc-success">
                    <Icon name="check" className="mr-2" />
                    Convite aceito
                  </h3>
                </>
              ) : (
                <>
                  <button
                    onClick={this.submit}
                    className="btn btn--block btn--size-3 btn-primary mb-3"
                    disabled={isSubmitting}
                  >
                    Participar dessa ONG
                    {isSubmitting && (
                      <ActivityIndicator
                        size={36}
                        fill="white"
                        className="ml-1"
                      />
                    )}
                  </button>
                  <Link href={resolvePage('/home')} as="/">
                    <a className="tc-muted tw-normal btn btn--block btn-text">
                      Não tenho interesse
                    </a>
                  </Link>
                </>
              )}
              {failed && (
                <ErrorMessage className="mt-2">
                  Falha ao conectarse com o servidor
                </ErrorMessage>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = ({
  user,
  organization,
  organizationMembers,
  organizationMembership,
}: RootState): Partial<OrganizationMembersPageProps> => ({
  currentUser: user!,
  organization: organization.node,
  nodes: organizationMembers.nodes || [],
  failed: Boolean(organizationMembership.error),
  joined: organizationMembership.fetched && !organizationMembership.error,
  isSubmitting: organizationMembership.fetching,
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (organizationSlug: string) =>
    dispatch(joinOrganization(organizationSlug)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrganizationMembersPage)
