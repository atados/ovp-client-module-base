import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { pushToDataLayer } from '~/lib/tag-manager'
import { catchErrorAndReport } from '~/lib/utils/error'
import { ReduxState } from '../root-reducer'
import { Project, ProjectRole } from './project'
import { PublicUserApplication } from './public-user'

export interface ApplicationPayload {
  project: Project
  role?: ProjectRole
  message: string
}

export interface ApplicationMeta {
  projectSlug: string
  roleId?: number
  currentUserSlug?: string
}

export const applyToProject = createAction<
  ApplicationPayload,
  PublicUserApplication,
  ApplicationMeta
>(
  'PROJECT_APPLY',
  async ({ project, message, role }, { getState }) => {
    const { user } = getState() as ReduxState

    if (!user) {
      throw new Error('You must be logged in')
    }

    const application = await fetchAPI(
      `/projects/${project.slug}/applies/apply/`,
      {
        method: 'POST',
        body: {
          role: role && role.id,
          phone: user.phone,
          message,
        },
        sessionToken: user.token,
      },
    ).catch(catchErrorAndReport)

    pushToDataLayer({
      event: 'project.apply',
      slug: project.slug,
    })

    return application
  },
  payload => ({
    projectSlug: payload.project.slug,
    roleId: payload.role && payload.role.id,
  }),
)

export interface UnapplicationPayload {
  projectSlug: string
  currentUserSlug: string
}

export interface UnaplicationMeta {
  projectSlug: string
}

export const unapplyFromProject = createAction<
  UnapplicationPayload,
  boolean,
  UnaplicationMeta
>(
  'PROJECT_UNAPPLY',
  async ({ projectSlug }, { getState }) => {
    const { user } = getState() as ReduxState

    if (!user) {
      return false
    }

    await fetchAPI(`/projects/${projectSlug}/applies/unapply/`, {
      method: 'POST',
      sessionToken: user.token,
    }).catch(catchErrorAndReport)

    pushToDataLayer({
      event: 'project.unapply',
      slug: projectSlug,
    })

    return true
  },
  payload => ({
    projectSlug: payload.projectSlug,
    currentUserSlug: payload.currentUserSlug,
  }),
)
