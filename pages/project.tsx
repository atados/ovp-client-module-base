import { NextPage } from 'next'
import Router from 'next/router'
import queryString from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
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
  ProjectPageStatus,
} from '~/components/ProjectPage'
import { NotFoundPageError } from '~/lib/next/errors'
import { doesUserHaveAccessToProject } from '~/lib/utils/project'
import { throwActionError } from '~/lib/utils/redux'
import { fetchProject } from '~/redux/ducks/project'
import { ReduxState } from '~/redux/root-reducer'
import { ProjectPageNavId, ProjectPageSubPage } from '~/types/project'
import { reportError } from '../lib/utils/error'
import { Config } from '../common'
import { useProjectApplication } from '~/components/ProjectApplication'
import { useToasts } from '~/components/Toasts'

const Sidebar = styled.div`
  min-width: 352px;
  max-width: 352px;
  margin-left: 32px;
`

interface ProjectPageProps {
  readonly subpage?: string
  readonly defaultRoleId?: number
}

const ProjectPage: NextPage<ProjectPageProps> = ({ subpage }) => {
  const [activeNavItemId, setActiveNavItemId] = useState<ProjectPageNavId>(
    subpage === ProjectPageSubPage.Stories
      ? ProjectPageNavId.Stories
      : ProjectPageNavId.Overview,
  )
  const { isOwner, project } = useSelector((state: ReduxState) => {
    const stateProject = state.project.node
    return {
      isOwner: Boolean(
        state.user &&
          stateProject &&
          ((stateProject.organization &&
            state.user.organizations.some(
              organization => stateProject.organization!.id === organization.id,
            )) ||
            state.user.uuid === stateProject.owner.uuid),
      ),
      project: stateProject,
    }
  })

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

  const openProjectApplication = useProjectApplication()
  const toasts = useToasts()

  const onApply = useCallback(
    (roleId?: number) => {
      try {
        openProjectApplication(project, roleId)
      } catch (error) {
        toasts.add(error.message, 'error', false)
      }
    },
    [project, openProjectApplication],
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
      onApply()
    }
  }, [subpage])

  return (
    <Layout>
      <Meta
        title={project.name}
        description={project.description}
        image={project.image && project.image.image_url}
      />
      <ProjectPageStatus project={project} />
      <ProjectPageHeader className="mb-4" project={project} isOwner={isOwner} />
      <ProjectPageNav
        project={project}
        isOwner={isOwner}
        activeNavItemId={activeNavItemId}
        onApply={onApply}
        onNavItemClick={handleNavItemClick}
      />
      {Config.project.posts && subpage === ProjectPageSubPage.Stories ? (
        <div className="container px-2 py-5">
          <ProjectPageStories project={project} />
        </div>
      ) : (
        <div className="container px-2 flex py-5">
          <div className="flex-grow">
            <ProjectPageAbout project={project} />
            <ProjectPageDisponibility project={project} />
            {Config.project.galleries && (
              <ProjectPageGalleries project={project} />
            )}
            {Config.project.documents &&
              (!Config.project.documentsRestricted || isOwner) && (
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
  req,
}) => {
  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  try {
    const { user: viewer } = store.getState()
    const project = await store
      .dispatch(fetchProject(slug))
      .then(throwActionError)

    // Throw a 404 page if the project is closed or not published and
    // an current user's organizations doesn't have access to it
    if (
      !project.published &&
      (!viewer || !doesUserHaveAccessToProject(viewer, project))
    ) {
      if (!project.published && !req) {
        reportError(
          `Project ${project.slug} is not published but was acessed via platform.`,
        )
      }
      throw new NotFoundPageError()
    }

    return {
      subpage: String(subpage),
      defaultRoleId: defaultRoleId
        ? parseInt(defaultRoleId as string, 10)
        : undefined,
    }
  } catch (error) {
    if (error.statusCode === 404) {
      throw new NotFoundPageError()
    }

    throw error
  }
}

export default ProjectPage
