import {
  combineActions,
  createAction,
  createReducer,
  PromiseAction,
} from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { FetchJSONError } from '~/lib/fetch/fetch.client'
import { reportError } from '~/lib/utils/error'
import { Cause, ImageDict, Skill } from '~/redux/ducks/channel'
import { Organization } from '~/redux/ducks/organization'
import { RootState } from '~/redux/root-reducer'
import { DocumentDict, Post } from '~/types/api'
import { bookmark, unbookmark } from './bookmark'
import {
  ApplicationMeta,
  applyToProject,
  unapplyFromProject,
} from './project-application'
import { closeProject } from './project-closure'
import { PublicUserApplication } from './public-user'

export interface Section {
  name: string
  slug: string
  projects: Project[]
}

export interface Catalogue {
  slug: string
  sections: Section[]
}

export interface Address {
  city_state: string
  typed_address: string
  typed_address2: string
  lat: number
  lng: number
}

export interface WorkDisponibility {
  type: 'work'
  work: {
    weekly_hours: number
    description: string
    can_be_done_remotely: boolean
  }
}

export interface JobDate {
  name: string
  start_date: string
  end_date: string
}

export interface JobDisponibility {
  type: 'job'
  job: {
    can_be_done_remotely: boolean
    dates: JobDate[]
    end_date?: string
    start_date?: string
  }
}

export type Disponibility = WorkDisponibility | JobDisponibility

interface ProjectApplicationUser {
  uuid: string
  name: string
  slug: string
  email: string
  phone: string
  rating: number
  avatar?: {
    image_small_url: string
    image_url: string
  }
}

export interface ProjectApplication {
  id: number
  date: string
  phone: string
  canceled: boolean
  user?: ProjectApplicationUser
  role?: ProjectRole
}

export interface ProjectRole {
  id: number
  name: string
  details: string
  applied_count: number
  prerequisites: string
  vacancies: number
  applies: ProjectApplication[]
}

interface ProjectOwner {
  id: number
  name: string
  uuid: string
  slug: string
  email: string
}

export interface Gallery {
  id: number
  uuid: string
  name: string
  description: string
  images: ImageDict[]
}

export interface Project {
  id?: number
  slug: string
  name: string
  applies: ProjectApplication[]
  description: string
  details: string
  owner: ProjectOwner
  published?: boolean
  posts: Post[]
  minimum_age?: number
  current_user_is_applied?: boolean
  applied_count: number
  max_applies_from_roles: number
  address?: Address
  causes: Cause[]
  skills: Skill[]
  closed: boolean
  canceled: boolean
  bookmark_count: number
  is_bookmarked: boolean
  organization?: Organization
  disponibility: Disponibility | null
  roles: ProjectRole[]
  benefited_people: number
  published_date?: string
  galleries: Gallery[]
  documents: DocumentDict[]
  image?: {
    image_url: string
    image_medium_url: string
  }
}

interface ProjectFetchMeta {
  slug: string
}

function sortJobDates(date1: JobDate, date2: JobDate): number {
  if (date1.start_date === date2.start_date) {
    return 0
  }

  return date1.start_date < date2.start_date ? -1 : 1
}

export const fetchProject = createAction<string, Project, ProjectFetchMeta>(
  'PROJECT_FETCH',
  async (slug, { prevent, getState }) => {
    const {
      user,
      startup: { causes },
      project: currentState,
    }: RootState = getState()

    if (slug === currentState.slug) {
      prevent()

      if (currentState.node) {
        return currentState.node
      }

      throw new FetchJSONError(
        { status: 404, url: `/project/${slug}` },
        undefined,
      )
    }

    const project = await fetchAPI<Project>(`/projects/${slug}/`, {
      sessionToken: user ? user.token : undefined,
    }).catch(error => {
      if (error && error.status !== 404) {
        reportError(error)
      }

      throw error
    })

    // TODO: [Backend] Fix applied_count. It's always sending as 1
    // Sync applied_count with applies length
    project.applied_count = project.applies.length

    if (project.disponibility && project.disponibility.type === 'job') {
      project.disponibility.job.dates = project.disponibility.job.dates.sort(
        sortJobDates,
      )
    }

    // Sort applies, so the ones with an user attached will come first
    project.applies = project.applies.sort((application1, application2) => {
      if (application1.user && application2.user) {
        return application1.user.uuid > application2.user.uuid ? 2 : -2
      }

      if (application1.user) {
        return 1
      }

      if (application2.user) {
        return -1
      }

      return 0
    })

    const projectRolesMap: { [id: number]: ProjectRole } = {}
    project.roles.forEach(role => {
      projectRolesMap[role.id] = role
    })
    project.applies.forEach(application => {
      if (application.role) {
        if (!projectRolesMap[application.role.id].applies) {
          projectRolesMap[application.role.id].applies = []
        }

        projectRolesMap[application.role.id].applies.push(application)
      }
    })

    // Replace causes with global causes so we can have 'color' property
    const causesIds: number[] = project.causes.map(cause => cause.id)
    project.causes = causes.filter(cause => causesIds.indexOf(cause.id) !== -1)

    if (
      project.disponibility &&
      project.disponibility.type === 'job' &&
      project.disponibility.job &&
      !project.disponibility.job.dates.length &&
      project.disponibility.job.start_date &&
      project.disponibility.job.end_date
    ) {
      project.disponibility.job.dates = [
        {
          name: 'Dia da ação',
          start_date: project.disponibility.job.start_date,
          end_date: project.disponibility.job.end_date,
        },
      ]
    }

    return project
  },
  slug => ({ slug }),
)

export const updateProject = createAction<
  Partial<Project> & { slug: string },
  Partial<Project> & { slug: string },
  { slug: string }
>(
  'UPDATE_PROJECT',
  undefined,
  (project): { slug: string } => ({ slug: project.slug }),
)

export interface ProjectReducerState {
  node?: Project
  slug?: string
  fetching?: boolean
}

export default createReducer<ProjectReducerState>(
  {
    [combineActions(String(closeProject))]: (state, action) => {
      if (
        state.node &&
        action.payload &&
        !action.error &&
        action.meta.slug === state.node.slug
      ) {
        return {
          ...state,
          node: {
            ...state.node,
            closed: true,
          },
        }
      }

      return state
    },
    [combineActions(String(bookmark), String(unbookmark))]: (state, action) => {
      if (
        state.node &&
        action.payload &&
        !action.error &&
        action.meta.slug === state.node.slug
      ) {
        return {
          ...state,
          node: {
            ...state.node,
            is_bookmarked: action.type === bookmark.type,
          },
        }
      }

      return state
    },
    [combineActions(String(applyToProject), String(unapplyFromProject))]: (
      state,
      action: PromiseAction<PublicUserApplication, ApplicationMeta>,
    ) => {
      if (state.node && action.payload && !action.error) {
        const applied = action.type === String(applyToProject)
        const node = {
          ...state.node,
          current_user_is_applied: applied,
        }

        if (applied) {
          node.applies = [
            action.payload as PublicUserApplication,
            ...node.applies,
          ]
          node.applied_count += 1
        } else {
          node.applied_count -= 1
          node.applies = node.applies.filter(
            application =>
              !application.user ||
              application.user.slug !== (action.meta.currentUserSlug as string),
          )
        }

        return {
          ...state,
          node,
        }
      }

      return state
    },
    [String(updateProject)]: (state, action) => {
      if (state.slug === action.meta.slug && state.node) {
        return {
          ...state,
          node: {
            ...state.node,
            ...action.payload,
          },
        }
      }
      return state
    },
    [String(fetchProject)]: (
      _,
      action: PromiseAction<Project, ProjectFetchMeta>,
    ) => ({
      slug: action.meta.slug,
      fetching: action.pending,
      node: !action.error ? (action.payload as Project) : undefined,
    }),
  },
  { fetching: false },
)
