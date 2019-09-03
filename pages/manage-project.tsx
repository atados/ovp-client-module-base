import { NextPageContext, NextPage } from 'next'
import React from 'react'
import { connect } from 'react-redux'
import { channel } from '~/common/constants'
import CloseProjectForm from '~/components/CloseProjectForm'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import { useModal } from '~/components/Modal'
import OrganizationLayout, {
  getOrganizationLayoutInitialProps,
} from '~/components/OrganizationLayout/OrganizationLayout'
import {
  ProjectManagePageDocuments,
  ProjectManagePageHeader,
  ProjectManagePageInfos,
  ProjectManagePageNav,
  ProjectManagePagePhotos,
  ProjectManagePagePosts,
  ProjectManagePageVolunteers,
} from '~/components/ProjectManagePage'
import { NotFoundPageError } from '~/lib/next/errors'
import { doesUserHaveAccessToProject } from '~/lib/utils/project'
import { throwActionError } from '~/lib/utils/redux'
import {
  fetchProject,
  Project,
  ProjectApplication,
} from '~/redux/ducks/project'
import { User, UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'

interface ManageProjectPageInitialProps {
  organizationSlug?: string
  slug: string
}

interface ManageProjectPageProps extends ManageProjectPageInitialProps {
  readonly currentUser: User
  readonly project: Project
  readonly organization?: UserOrganization
  readonly fetching?: boolean
  readonly fetchingApplications?: boolean
  readonly applications: ProjectApplication[]
}

const ManageProjectPage: NextPage<
  ManageProjectPageProps,
  ManageProjectPageInitialProps
> = ({ project, organization }) => {
  const openClosureModal = useModal({
    id: 'CloseProject',
    component: CloseProjectForm as any,
    cardClassName: 'p-5',
  })
  const children = (
    <div className="pb-5 bg-muted">
      <Meta
        title={project.name}
        description={project.description}
        image={project.image && project.image.image_url}
      />
      <ProjectManagePageHeader project={project} />
      <ProjectManagePageNav
        project={project}
        organization={organization}
        className="mb-4"
      />
      <div className="container">
        <ProjectManagePageInfos project={project} />
        <ProjectManagePageVolunteers project={project} />
        {channel.config.project.posts && (
          <ProjectManagePagePosts
            project={project}
            organizationSlug={organization && organization.slug}
          />
        )}
        <div className="row">
          {channel.config.project.galleries && (
            <div className="col-lg-6">
              <ProjectManagePagePhotos project={project} />
            </div>
          )}
          {channel.config.project.documents && (
            <div className="col-lg-6">
              <ProjectManagePageDocuments project={project} />
            </div>
          )}
        </div>
        {!project.closed && (
          <div className="radius-10 shadow bg-error-light p-4">
            <h4 className="tw-normal mb-0">Encerrar vaga</h4>
            <span className="tc-muted-dark mb-0 block mb-3">
              Ao encerrar a vaga você não poderá mais reabri-la, ela sairá da
              listagem na plataforma e não poderá receber mais inscrições.
            </span>
            <button
              type="button"
              onClick={openClosureModal}
              className="btn btn-error"
            >
              Encerrar vaga
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (organization) {
    return (
      <OrganizationLayout organization={organization} isCurrentUserMember>
        {children}
      </OrganizationLayout>
    )
  }

  return <Layout>{children}</Layout>
}
ManageProjectPage.getInitialProps = async (
  context: NextPageContext,
): Promise<ManageProjectPageInitialProps> => {
  const {
    store,
    query: { slug, organizationSlug },
  } = context
  if (organizationSlug) {
    await getOrganizationLayoutInitialProps(context, true)
  }

  const { user: currentUser } = store.getState()

  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }
  const project = await store
    .dispatch(fetchProject(slug))
    .then(throwActionError)

  if (!currentUser || !doesUserHaveAccessToProject(currentUser, project)) {
    throw new NotFoundPageError()
  }

  return {
    organizationSlug: organizationSlug && String(organizationSlug),
    slug,
  }
}
ManageProjectPage.displayName = 'ManageProjectPage'

const mapStateToProps = (
  { user, project }: RootState,
  { organizationSlug },
): Partial<ManageProjectPageProps> => {
  return {
    currentUser: user!,
    organization:
      (organizationSlug &&
        user &&
        user.organizations.find(
          userOrganization => userOrganization.slug === organizationSlug,
        )) ||
      undefined,
    fetching: project.fetching,
    project: project.node,
  }
}

export default connect(mapStateToProps)(ManageProjectPage)
