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
  ProjectManagePageApplications,
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
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

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

const { ENCERRAR_VAGA, ENCERRAR_VAGA_TEXT } = defineMessages({
  ENCERRAR_VAGA: {
    id: 'ENCERRAR_VAGA',
    defaultMessage: 'Encerrar vaga',
  },
  ENCERRAR_VAGA_TEXT: {
    id: 'ENCERRAR_VAGA_TEXT',
    defaultMessage:
      'Ao encerrar a vaga você não poderá mais reabri-la, ela sairá da listagem na plataforma e não poderá receber mais inscrições.',
  },
})

const ManageProjectPage: NextPage<
  ManageProjectPageProps,
  ManageProjectPageInitialProps
> = ({ project, organization }) => {
  const intl = useIntl()

  const openClosureModal = useModal({
    id: 'CloseProject',
    component: CloseProjectForm as any,
    componentProps: {
      projectSlug: project.slug,
    },
    onClosePropName: 'onCancel',
    cardClassName: 'p-5',
  })
  const children = (
    <div className="pb-8 bg-muted">
      <Meta
        title={project.name}
        description={project.description}
        image={project.image && project.image.image_url}
      />
      <ProjectManagePageHeader project={project} />
      <ProjectManagePageNav
        project={project}
        organization={organization}
        className="mb-6"
      />
      <div className="container px-2">
        <ProjectManagePageInfos project={project} />
        <ProjectManagePageApplications project={project} />
        {channel.config.project.posts && (
          <ProjectManagePagePosts
            project={project}
            organizationSlug={organization && organization.slug}
          />
        )}
        <div className="flex flex-wrap -mx-2">
          {channel.config.project.galleries && (
            <div className="w-full lg:w-1/2 px-2">
              <ProjectManagePagePhotos project={project} />
            </div>
          )}
          {channel.config.project.documents && (
            <div className="w-full lg:w-1/2 px-2">
              <ProjectManagePageDocuments project={project} />
            </div>
          )}
        </div>
        {!project.closed && (
          <div className="rounded-lg shadow bg-red-200 p-4">
            <h4 className="font-normal mb-0">
              {intl.formatMessage(ENCERRAR_VAGA)}
            </h4>
            <span className="text-gray-700 mb-0 block mb-4">
              {intl.formatMessage(ENCERRAR_VAGA_TEXT)}
            </span>
            <button
              type="button"
              onClick={() => openClosureModal()}
              className="btn btn-error"
            >
              {intl.formatMessage(ENCERRAR_VAGA)}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (organization) {
    return (
      <OrganizationLayout organization={organization} isViewerMember>
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
    query: { projectSlug, organizationSlug },
  } = context
  if (organizationSlug) {
    await getOrganizationLayoutInitialProps(context, true)
  }

  const { user: currentUser } = store.getState()

  if (typeof projectSlug !== 'string') {
    throw new NotFoundPageError()
  }
  const project = await store
    .dispatch(fetchProject(projectSlug))
    .then(throwActionError)

  if (!currentUser || !doesUserHaveAccessToProject(currentUser, project)) {
    throw new NotFoundPageError()
  }

  return {
    organizationSlug: organizationSlug && String(organizationSlug),
    slug: projectSlug,
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
