import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import queryString from 'query-string'
import React, { useCallback, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import ActivityIndicator from '~/components/ActivityIndicator'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import MultipleStepsForm from '~/components/MultipleStepsForm/MultipleStepsForm'
import MultipleStepsFormErrorReport from '~/components/MultipleStepsForm/MultipleStepsFormErrorReport'
import MultipleStepsFormTabs from '~/components/MultipleStepsFormTabs'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import ProjectComposer from '~/components/ProjectComposer'
import useLocalStorage from '~/hooks/use-local-storage'
import { fetchAPI } from '~/lib/fetch/fetch.client'
import { NotFoundPageError } from '~/lib/next/errors'
import { pushToDataLayer } from '~/lib/tag-manager'
import { throwActionError } from '~/lib/utils/redux'
import { fetchProject, Project, updateProject } from '~/redux/ducks/project'
import { User, UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { Page, PageAs } from '~/common'

const PageStyled = styled.div`
  background: #eef0f3;
  min-height: 100vh;
`

const Card = styled.div`
  border-radius: 10px 10px 0 0;
  min-height: calc(100vh - ${channel.theme.toolbarHeight}px - 64px);
  border-bottom-width: 0;
`

const ErrorReport = styled(MultipleStepsFormErrorReport)`
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  top: -1px;
`

const ProjectThumbnail = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
`

export interface ProjectComposerDraft {
  value: Partial<Project>
  createdAt: number
  updatedAt: number
}

function getRouterInfo(
  mode?: FormComposerMode,
  organization?: UserOrganization,
  projectSlug?: string,
  stepId?: string,
): string {
  const query: {
    organizationSlug?: string
    projectSlug?: string
    stepId?: string
  } = { stepId, projectSlug }
  let asPath = ''

  if (projectSlug) {
    query.projectSlug += `&projectSlug=${projectSlug}`
  }

  if (organization) {
    query.organizationSlug = organization.slug
    asPath = `/ong/${organization.slug}`

    if (mode === FormComposerMode.EDIT) {
      asPath += `/vagas/editar/${projectSlug}`
    }

    if (mode === FormComposerMode.DUPLICATE) {
      asPath += `/vagas/duplicar/${projectSlug}`
    }
  }

  if (!mode || mode === FormComposerMode.CREATE) {
    asPath += `/criar-vaga`
  } else if (mode === FormComposerMode.DUPLICATE) {
    asPath = `/minhas-vagas/duplicar/${projectSlug}`
  }

  return asPath
}

interface ProjectComposerPageProps {
  readonly stepId?: string
  readonly draftIndex?: number
  readonly className?: string
  readonly organization?: UserOrganization
  readonly mode?: FormComposerMode
  readonly projectSlug?: string
  readonly user: User
  readonly project?: Project
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string },
  ) => any
}

const ProjectComposerPage: NextPage<
  ProjectComposerPageProps,
  Pick<
    ProjectComposerPageProps,
    'draftIndex' | 'organization' | 'organization' | 'projectSlug'
  >
> = ({
  stepId,
  organization,
  mode,
  project,
  projectSlug,
  user,
  draftIndex,
  onUpdateProject,
}) => {
  const page = '/project-composer'
  const drafts = useLocalStorage<ProjectComposerDraft[]>(
    '@project-composer/drafts',
    [],
  )
  const nextDraftIndexRef = useRef<number | null>(null)
  let draft =
    mode !== FormComposerMode.EDIT && draftIndex !== undefined
      ? drafts.value[draftIndex]
      : undefined

  const handleSubmit = useCallback(
    async (value, { setCurrentStepId }) => {
      const body = {
        ...value,
        owner: undefined,
        slug: mode === FormComposerMode.EDIT ? value.slug : undefined,
        causes: value.causes.map(cause => ({ id: cause.id })),
        skills: value.skills.map(skill => ({ id: skill.id })),
        posts: undefined,
        galleries: undefined,
        channel: undefined,
        documents: undefined,
        organization: undefined,
        roles:
          mode === FormComposerMode.DUPLICATE
            ? value.roles.map(role => ({ ...role, id: undefined }))
            : value.roles,
        organization_id: organization
          ? organization.id
          : value.organization
          ? value.organization.id
          : value.organization_id,
      }

      if (mode === FormComposerMode.EDIT) {
        const updatedProject: Project = await fetchAPI(
          `/projects/${projectSlug}/`,
          {
            method: 'PATCH',
            sessionToken: user.token,
            body,
          },
        )

        pushToDataLayer({
          event: 'update_project',
          type: 'cause',
          text: updatedProject.name,
          slug: updatedProject.slug,
          organization_id: updatedProject.organization
            ? updatedProject.organization.id!
            : null,
        })

        onUpdateProject(updatedProject)
        return updatedProject
      }

      const newProject: Project = await fetchAPI('/projects/', {
        method: 'POST',
        sessionToken: user.token,
        body,
      })

      pushToDataLayer({
        event: 'new_project',
        type: 'cause',
        text: newProject.name,
        slug: newProject.slug,
        organization_id: newProject.organization
          ? newProject.organization.id!
          : null,
      })

      setCurrentStepId('criado')

      drafts.update(drafts.value.filter((_, index) => index !== draftIndex))
      return newProject
    },
    [drafts, projectSlug, onUpdateProject],
  )

  const routerAsPath = useMemo(
    () => getRouterInfo(mode, organization, projectSlug, stepId),
    [mode, organization, projectSlug, stepId],
  )
  const handleStepChange = useCallback(
    newStepId => {
      const newRouterAsPath = getRouterInfo(
        mode,
        organization,
        projectSlug,
        newStepId,
      )

      const newDraftIndex =
        nextDraftIndexRef.current !== null
          ? nextDraftIndexRef.current
          : draftIndex
      nextDraftIndexRef.current = null

      Router.push(
        `${page}?${queryString.stringify({
          mode,
          projectSlug,
          organizationSlug: organization ? organization.slug : undefined,
          stepId: newStepId,
          draftIndex: newDraftIndex,
        })}`,
        `${newRouterAsPath}/${newStepId}${
          newDraftIndex !== undefined ? `?draftIndex=${newDraftIndex}` : ''
        }`,
      )
    },
    [organization, draftIndex, mode, projectSlug],
  )

  const handleStepSubmit = useCallback(
    (_, newValue, { steps, currentStepId, setCurrentStepId, submit }) => {
      if (mode === FormComposerMode.EDIT) {
        submit()
        return
      }

      if (draft) {
        draft = {
          ...draft,
          updatedAt: Date.now(),
          value: newValue,
        }

        drafts.update(
          drafts.value.map((draftItem, i) => {
            if (i === draftIndex) {
              return draft!
            }

            return draftItem
          }),
        )
      } else {
        draft = {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          value: newValue,
        }
        drafts.update([...drafts.value, draft])
        nextDraftIndexRef.current = drafts.value.length
      }

      if (
        !steps.some(step => !step.done) &&
        currentStepId === steps[steps.length - 1].id
      ) {
        submit()
        return
      }

      let found = false
      steps.some(step => {
        if (found) {
          setCurrentStepId(step.id)
          return true
        }

        if (step.id === currentStepId) {
          found = true
        }

        return false
      })
    },
    [drafts, draft],
  )
  const defaultValue = useMemo(() => {
    if (mode === FormComposerMode.CREATE) {
      return draft ? draft.value : undefined
    }

    return project
  }, [draft, mode])

  const form = drafts.loading ? (
    <div className="ta-center">
      <ActivityIndicator size={84} className="mt-4" />
    </div>
  ) : (
    <MultipleStepsForm
      key={draftIndex === undefined ? -1 : draftIndex}
      stepId={stepId}
      defaultValue={defaultValue}
      onSubmit={handleSubmit}
      onStepIdChange={handleStepChange}
      onStepSubmit={handleStepSubmit}
      context={{ organization, mode }}
    >
      <div className="container pt-2">
        {project && (
          <>
            <Link
              href={
                organization
                  ? Page.OrganizationDashboardProject
                  : Page.ViewerProjectDashboard
              }
              as={
                organization
                  ? PageAs.OrganizationDashboardProject({
                      organizationSlug: organization.slug,
                      slug: project.slug,
                    })
                  : PageAs.ViewerProjectDashboard({ slug: project.slug })
              }
            >
              <a className="media tc-base">
                <ProjectThumbnail
                  className="bg-cover"
                  style={
                    project.image
                      ? { backgroundImage: `url('${project.image.image_url}')` }
                      : { backgroundColor: '#ddd' }
                  }
                />
                <div className="media-body ml-3">
                  <span className="block tc-primary-500 tw-medium ts-small">
                    {mode === FormComposerMode.EDIT
                      ? 'EDITANDO VAGA'
                      : 'DUPLICANDO VAGA'}
                  </span>
                  <span className="tw-medium block text-truncate">
                    {project.name}
                  </span>
                </div>
              </a>
            </Link>
            <hr className="mb-0" />
          </>
        )}
        <MultipleStepsFormTabs
          pathname={page}
          as={`${routerAsPath}/`}
          query={{
            projectSlug,
            organizationSlug: organization ? organization.slug : undefined,
            mode,
            draftIndex,
          }}
        />
        <Card className="card">
          <ErrorReport />
          <ProjectComposer
            routerPathname={page}
            routerAs={routerAsPath}
            organization={organization}
            projectSlug={projectSlug}
            mode={mode}
            draftIndex={draftIndex}
            drafts={drafts.value}
          />
        </Card>
      </div>
    </MultipleStepsForm>
  )

  return (
    <PageStyled>
      <Meta title="Nova vaga" />
      {organization ? (
        <OrganizationLayout
          layoutProps={{ disableFooter: true }}
          isCurrentUserMember
          organization={organization}
        >
          {form}
        </OrganizationLayout>
      ) : (
        <Layout disableFooter>{form}</Layout>
      )}
    </PageStyled>
  )
}

ProjectComposerPage.displayName = 'ProjectComposerPage'
ProjectComposerPage.getInitialProps = async ({ query, store }) => {
  const { user } = store.getState()
  const { organizationSlug, projectSlug } = query

  if (!user) {
    throw new NotFoundPageError()
  }

  let organization: UserOrganization | null | undefined
  if (organizationSlug) {
    organization =
      user && user.organizations.find(o => o.slug === organizationSlug)

    if (
      !user ||
      // Check if user has permission to edit this organization
      !organization
    ) {
      throw new NotFoundPageError()
    }
  }

  let stepId = query.stepId ? String(query.stepId) : 'inicio'

  if (projectSlug) {
    if (stepId === 'inicio') {
      stepId = 'geral'
    }

    await store
      .dispatch(fetchProject(String(projectSlug)))
      .then(throwActionError)
  }

  const mode = String(query.mode)
  return {
    stepId,
    mode:
      mode === FormComposerMode.CREATE ||
      mode === FormComposerMode.DUPLICATE ||
      mode === FormComposerMode.EDIT
        ? mode
        : FormComposerMode.CREATE,
    projectSlug: projectSlug ? String(projectSlug) : undefined,
    draftIndex: query.draftIndex
      ? parseInt(String(query.draftIndex), 10)
      : undefined,
    organization: organization || undefined,
  }
}

export default connect(
  (state: RootState, ownProps: ProjectComposerPageProps) => ({
    user: state.user!,
    project:
      ownProps.projectSlug === state.project.slug
        ? state.project.node
        : undefined,
  }),
  { onUpdateProject: updateProject },
)(ProjectComposerPage)
