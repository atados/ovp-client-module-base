import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import queryString from 'query-string'
import React, { useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import { UserOrganization } from '~/redux/ducks/user'
import BeforeActionAuth from '~/components/BeforeActionAuth'
import { RootState } from '~/redux/root-reducer'
import { Page, PageAs, RequiredPagesMap } from '~/common'
import { FormattedMessage } from 'react-intl'

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

function getRouteName(
  mode?: FormComposerMode,
  organization?: UserOrganization,
): keyof RequiredPagesMap {
  if (organization) {
    if (mode === FormComposerMode.EDIT) {
      return 'OrganizationEditProject'
    }

    if (mode === FormComposerMode.DUPLICATE) {
      return 'OrganizationDuplicateProject'
    }

    return 'OrganizationNewProject'
  }

  if (mode === FormComposerMode.EDIT) {
    return 'EditProject'
  }

  if (mode === FormComposerMode.DUPLICATE) {
    return 'DuplicateProject'
  }

  return 'NewProject'
}

interface ProjectComposerPageProps {
  readonly stepId?: string
  readonly draftIndex?: number
  readonly className?: string
  readonly organization?: UserOrganization
  readonly mode?: FormComposerMode
  readonly projectSlug?: string
}

const ProjectComposerPage: NextPage<
  ProjectComposerPageProps,
  Pick<
    ProjectComposerPageProps,
    'draftIndex' | 'organization' | 'organization' | 'projectSlug'
  >
> = ({ stepId, organization, mode, projectSlug, draftIndex }) => {
  const dispatchToRedux = useDispatch()
  const { viewer, project } = useSelector((state: RootState) => ({
    viewer: state.user!,
    project:
      projectSlug === state.project.slug ? state.project.node : undefined,
  }))
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
            sessionToken: viewer.token,
            body,
          },
        )

        pushToDataLayer({
          event: 'project.update',
          text: updatedProject.name,
          slug: updatedProject.slug,
          organizationSlug: updatedProject.organization
            ? updatedProject.organization.slug
            : null,
        })

        dispatchToRedux(updateProject(updatedProject))
        return updatedProject
      }

      const newProject: Project = await fetchAPI('/projects/', {
        method: 'POST',
        sessionToken: viewer.token,
        body,
      })

      pushToDataLayer({
        event: 'project.new',
        text: newProject.name,
        slug: newProject.slug,
        organizationSlug: newProject.organization
          ? newProject.organization.slug!
          : null,
      })

      setCurrentStepId('criado')

      drafts.update(drafts.value.filter((_, index) => index !== draftIndex))
      return newProject
    },
    [drafts, projectSlug, viewer, dispatchToRedux],
  )

  const pageName = getRouteName(mode, organization)
  const handleStepChange = useCallback(
    newStepId => {
      const newDraftIndex =
        nextDraftIndexRef.current !== null
          ? nextDraftIndexRef.current
          : draftIndex
      nextDraftIndexRef.current = null

      const pathSearch = queryString.stringify({
        draftIndex: newDraftIndex,
      })
      Router.push(
        `${Page[pageName]}?${pathSearch}`,
        `${PageAs[pageName]({
          stepId: newStepId,
          organizationSlug: organization && organization.slug,
          projectSlug,
        })}?${pathSearch}`,
      )
    },
    [organization, draftIndex, viewer, mode, projectSlug, pageName],
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
    [drafts, draft, viewer],
  )

  const form = drafts.loading ? (
    <div className="text-center">
      <ActivityIndicator size={84} className="mt-6" />
    </div>
  ) : (
    <MultipleStepsForm
      key={`${draftIndex === undefined ? -1 : draftIndex}${project &&
        project.slug}`}
      stepId={stepId}
      defaultValue={draft ? draft.value : project}
      onSubmit={handleSubmit}
      onStepIdChange={handleStepChange}
      onStepSubmit={handleStepSubmit}
      context={{ organization, mode }}
    >
      <div className="container px-2 pt-3">
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
                      projectSlug: project.slug,
                    })
                  : PageAs.ViewerProjectDashboard({ projectSlug: project.slug })
              }
            >
              <a className="media text-gray-800">
                <ProjectThumbnail
                  className="bg-cover bg-center"
                  style={
                    project.image
                      ? { backgroundImage: `url('${project.image.image_url}')` }
                      : { backgroundColor: '#ddd' }
                  }
                />
                <div className="media-body ml-4">
                  <span className="block text-primary-500 font-medium text-sm">
                    {mode === FormComposerMode.EDIT ? (
                      <FormattedMessage
                        id="pages.projectComposer.editModeTitle"
                        defaultMessage="EDITANDO VAGA"
                      />
                    ) : (
                      <FormattedMessage
                        id="pages.projectComposer.duplicateModeTitle"
                        defaultMessage="DUPLICANDO VAGA"
                      />
                    )}
                  </span>
                  <span className="font-medium block truncate">
                    {project.name}
                  </span>
                </div>
              </a>
            </Link>
            <hr className="mb-0" />
          </>
        )}
        <MultipleStepsFormTabs
          pageName={pageName}
          query={{
            projectSlug,
            organizationSlug: organization ? organization.slug : undefined,
            mode,
            draftIndex,
            stepId,
          }}
        />
        <Card className="card">
          <ErrorReport />
          <ProjectComposer
            pageName={pageName}
            organization={organization}
            drafts={drafts.value}
          />
        </Card>
      </div>
    </MultipleStepsForm>
  )

  if (!viewer) {
    return (
      <PageStyled>
        <Meta title="Nova vaga" />
        <Layout disableFooter>
          <BeforeActionAuth
            title={
              <FormattedMessage
                id="projectComposer.beforeAuth.title"
                defaultMessage="Entre na sua conta antes de criar uma vaga"
              />
            }
            subtitle={
              <FormattedMessage
                id="projectComposer.beforeAuth.subtitle"
                defaultMessage="Além de poder criar uma vaga, você pode receber recomendações das melhores vagas"
              />
            }
          />
        </Layout>
      </PageStyled>
    )
  }

  return (
    <PageStyled>
      <Meta title="Nova vaga" />
      {organization ? (
        <OrganizationLayout
          layoutProps={{ disableFooter: true }}
          isViewerMember
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

export default ProjectComposerPage
