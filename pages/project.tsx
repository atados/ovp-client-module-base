import { User } from '@sentry/types'
import { NextPage } from 'next'
import Router from 'next/router'
import queryString from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import Authentication from '~/components/Authentication'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import { useModal } from '~/components/Modal'
import ProjectApplication, {
  ProjectApplicationProps,
} from '~/components/ProjectApplication/ProjectApplication'
import {
  ProjectPageAbout,
  ProjectPageAddress,
  ProjectPageDisponibility,
  ProjectPageDocuments,
  ProjectPageGalleries,
  ProjectPageHeader,
  ProjectPageNav,
  ProjectPageOrganization,
  ProjectPageRoles,
  ProjectPageStories,
} from '~/components/ProjectPage'
import { NotFoundPageError } from '~/lib/next/errors'
import { doesUserHaveAccessToProject } from '~/lib/utils/project'
import { throwActionError } from '~/lib/utils/redux'
import { fetchProject, Project } from '~/redux/ducks/project'
import { RootState } from '~/redux/root-reducer'
import { ProjectPageNavId, ProjectPageSubPage } from '~/types/project'

const Sidebar = styled.div`
  min-width: 352px;
  max-width: 352px;
  margin-left: 32px;
`

interface ProjectPageReduxProps {
  readonly isOwner: boolean
  readonly currentUser: User | null
  readonly project?: Project
}

interface ProjectPageInitialProps {
  readonly subpage?: string
  readonly defaultRoleId?: number
}

interface ProjectPageProps
  extends ProjectPageReduxProps,
    ProjectPageInitialProps {}

const ProjectPage: NextPage<ProjectPageProps, ProjectPageInitialProps> = ({
  project,
  isOwner,
  subpage,
  currentUser,
}) => {
  const [activeNavItemId, setActiveNavItemId] = useState<ProjectPageNavId>(
    subpage === ProjectPageSubPage.Stories
      ? ProjectPageNavId.Stories
      : ProjectPageNavId.Overview,
  )

  useEffect(() => {
    if (
      project &&
      project.posts.length &&
      subpage === ProjectPageSubPage.Stories &&
      activeNavItemId !== ProjectPageNavId.Stories
    ) {
      setActiveNavItemId(ProjectPageNavId.Stories)
    }
  }, [subpage, project])

  if (!project) {
    return <Layout disableFooter />
  }

  const openApplicationModal = useModal(
    currentUser
      ? {
          id: 'Application',
          component: ProjectApplication,
          componentProps: {
            project,
          },
          cardClassName: 'no-shadow no-background',
        }
      : {
          id: 'Authentication',
          component: Authentication,
          cardClassName: 'p-5',
          componentProps: {
            successRedirect: `/vaga/${project.slug}/${ProjectPageSubPage.ApplicationForm}`,
          },
        },
  )

  const onApply = useCallback(
    (roleId?: number) => {
      if (isOwner) {
        return
      }

      openApplicationModal(
        currentUser
          ? ({
              roleId,
            } as ProjectApplicationProps)
          : {
              successRedirect: `/vaga/${project.slug}/${ProjectPageSubPage.ApplicationForm}`,
            },
      )
    },
    [isOwner, openApplicationModal, project, currentUser],
  )

  const handleNavItemClick = useCallback(
    (id: ProjectPageNavId, event: React.MouseEvent<any>) => {
      if (id === ProjectPageNavId.Stories) {
        event.preventDefault()
        Router.push(
          `${Router.pathname}?${queryString.stringify({
            ...Router.query,
            subpage: ProjectPageSubPage.Stories,
          })}`,
          `/vaga/${project.slug}/${ProjectPageSubPage.Stories}`,
        )
      } else if (subpage === ProjectPageSubPage.Stories) {
        event.preventDefault()
        Router.push(
          `${Router.pathname}?${queryString.stringify({
            ...Router.query,
            subpage: undefined,
          })}`,
          `/vaga/${project.slug}/#${id}`,
        )
      }

      setActiveNavItemId(id)
    },
    [project, subpage],
  )

  useEffect(() => {
    if (subpage === ProjectPageSubPage.ApplicationForm && !isOwner) {
      openApplicationModal()
    }
  }, [subpage])

  return (
    <Layout>
      <Meta
        title={project.name}
        description={project.description}
        image={project.image && project.image.image_url}
      />

      <ProjectPageHeader className="mb-3" project={project} isOwner={isOwner} />
      <ProjectPageNav
        project={project}
        isOwner={isOwner}
        activeNavItemId={activeNavItemId}
        onApply={openApplicationModal}
        onNavItemClick={handleNavItemClick}
      />
      {channel.config.project.posts &&
      subpage === ProjectPageSubPage.Stories ? (
        <div className="container py-4">
          <ProjectPageStories project={project} />
        </div>
      ) : (
        <div className="container flex py-4">
          <div className="flex-grow">
            <ProjectPageAbout project={project} />
            <ProjectPageDisponibility project={project} />
            {channel.config.project.galleries && (
              <ProjectPageGalleries project={project} />
            )}
            {channel.config.project.documents &&
              (!channel.config.project.documentsRestricted || isOwner) && (
                <ProjectPageDocuments project={project} />
              )}
            <ProjectPageAddress project={project} />
            <ProjectPageOrganization project={project} />
          </div>
          <Sidebar className="hidden lg:block">
            <ProjectPageRoles
              project={project}
              isOwner={isOwner}
              onApply={onApply}
            />
          </Sidebar>
        </div>
      )}
    </Layout>
  )
}

ProjectPage.displayName = 'ProjectPage'
ProjectPage.getInitialProps = async ({
  store,
  query: { slug, subpage, defaultRoleId },
}) => {
  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  try {
    const { user: currentUser } = store.getState()
    const project = await store
      .dispatch(fetchProject(slug))
      .then(throwActionError)

    // Throw a 404 page if the project is closed or not published and
    // an current user's organizations doesn't have access to it
    if (
      !project.published &&
      (!currentUser || !doesUserHaveAccessToProject(currentUser, project))
    ) {
      throw new NotFoundPageError()
    }

    return {
      subpage: String(subpage),
      defaultRoleId: defaultRoleId
        ? parseInt(defaultRoleId as string, 10)
        : undefined,
    }
  } catch (error) {
    if (error.status === 404) {
      throw new NotFoundPageError()
    }

    throw error
  }
}

const mapStateToProps = ({
  user: currentUser,
  project: { node: project },
}: RootState): ProjectPageReduxProps => ({
  isOwner: Boolean(
    currentUser &&
      project &&
      ((project.organization &&
        currentUser.organizations.some(
          organization => project.organization!.id === organization.id,
        )) ||
        currentUser.uuid === project.owner.uuid),
  ),
  currentUser,
  project,
})

export default connect(mapStateToProps)(ProjectPage)
