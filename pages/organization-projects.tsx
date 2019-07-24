import { NextContext } from 'next'
import React from 'react'
import { connect } from 'react-redux'
import { getOrganizationLayoutInitialProps } from '~/components/OrganizationLayout/OrganizationLayout'
import OrganizationPageLayout from '~/components/OrganizationLayout/OrganizationPageLayout'
import ProjectCardList, {
  ProjectCardListSize,
} from '~/components/ProjectCard/ProjectCardList'
import Toolbar from '~/components/Toolbar'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
import { NodeKind, searchProjects } from '~/redux/ducks/search'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'

interface OrganizationPageProps {
  readonly fetchingProjects?: boolean
  readonly isCurrentUserMember: boolean
  readonly organization: Organization
  readonly projects: Project[]
  readonly authenticatedUser: User | null
}

class OrganizationPage extends React.Component<OrganizationPageProps> {
  public static async getInitialProps(
    context: NextContext,
  ): Promise<Partial<OrganizationPageProps>> {
    await getOrganizationLayoutInitialProps(context)
    const {
      user,
      organization: { node: organization },
    } = context.store.getState()

    const { store } = context

    const projectsPromise = store.dispatch(
      searchProjects({
        published: 'true',
        closed: 'both',
        organization_id: organization!.id,
        ordering: 'closed&-published_date',
      }),
    )

    if (context.req) {
      await projectsPromise
    }

    return {
      isCurrentUserMember: Boolean(
        user && user.organizations.some(o => o.slug === organization!.slug),
      ),
    }
  }

  public render() {
    const {
      projects,
      organization,
      fetchingProjects,
      isCurrentUserMember,
    } = this.props

    if (!organization) {
      // @ts-ignore
      return <Toolbar fixed />
    }

    return (
      <OrganizationPageLayout
        organization={organization}
        isCurrentUserMember={isCurrentUserMember}
      >
        <h1 className="ts-medium tw-medium mb-4">Vagas da ONG</h1>
        <ProjectCardList
          projects={projects}
          size={ProjectCardListSize.WIDE}
          fetching={fetchingProjects}
        />
      </OrganizationPageLayout>
    )
  }
}
const mapStateToProps = ({
  user,
  organization,
  search,
}: RootState): Partial<OrganizationPageProps> => {
  const projects: Project[] = []

  if (
    organization.node &&
    search.filters &&
    search.filters.organization_id === organization.node.id &&
    !search.fetching
  ) {
    search.sources.forEach(source => {
      if (source.nodeKind === NodeKind.Project) {
        projects.push(
          ...(source.nodes.filter(
            (project: Project) =>
              organization.node &&
              project.organization &&
              project.organization.slug === organization.node.slug,
          ) as Project[]),
        )
      }
    })
  }

  return {
    fetchingProjects: search.fetching,
    authenticatedUser: user,
    organization: organization.node,
    projects,
  }
}

export default connect(mapStateToProps)(OrganizationPage)
