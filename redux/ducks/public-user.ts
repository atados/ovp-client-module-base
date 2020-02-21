import { createAction, createReducer, PromiseAction } from 'redux-handy'
import { getRandomColor } from '~/lib/color/manager'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import {
  Project,
  ProjectRole,
  ProjectApplicationStatus,
} from '~/redux/ducks/project'
import { RootState } from '../root-reducer'
import { RatingProject } from './ratings'
import { UserProfile } from './user'
import { ImageDict } from '~/types/api-typings'

export interface PublicUserApplication {
  id: number
  date: string
  phone: string
  dateYear?: number
  project: Project
  canceled: boolean
  status: ProjectApplicationStatus
  role?: ProjectRole
  project_rating?: RatingProject
}

export type BookmarksList = Array<{
  project: Project
}>

export interface PublicUser {
  uuid: string
  name: string
  phone?: string
  slug: string
  city: string
  color: string
  volunteer_hours: number
  profile: UserProfile
  bookmarked_projects: BookmarksList
  avatar?: ImageDict
  applies: PublicUserApplication[]
}

interface FetchPublicUserMeta {
  slug: string
}

export const fetchPublicUser = createAction<
  string,
  PublicUser,
  FetchPublicUserMeta
>(
  'PUBLIC_USER_FETCH',
  async (slug, { prevent, getState }) => {
    const {
      user,
      startup: startupData,
      currentUserProfile,
      publicUser: currentState,
    } = getState() as RootState

    if (slug === currentState.slug && currentState.node) {
      prevent()

      return currentState.node
    }

    if (user && slug === user.slug && currentUserProfile.node) {
      return currentUserProfile.node
    }

    const publicUser = await fetchAPI<PublicUser>(`/public-users/${slug}/`, {
      sessionToken: user ? user.token : undefined,
    })

    if (!publicUser.color) {
      publicUser.color = getRandomColor()
    }

    publicUser.profile = publicUser.profile || {}
    publicUser.profile.causes = publicUser.profile.causes || []
    publicUser.profile.skills = publicUser.profile.skills || []
    publicUser.applies = publicUser.applies
      ? publicUser.applies.sort((a, b) => {
          if (a.date && b.date) {
            return b.date.localeCompare(a.date)
          }

          if (a.date) {
            return -1
          }

          if (b.date) {
            return 1
          }

          return 0
        })
      : []

    // Replace causes with global causes so we can have 'color' property
    const causesIds: number[] = publicUser.profile.causes.map(cause => cause.id)
    publicUser.profile.causes = startupData.causes.filter(
      cause => causesIds.indexOf(cause.id) !== -1,
    )

    return publicUser
  },
  slug => ({ slug }),
)

export interface PublicUserReducerState {
  slug?: string
  fetching?: boolean
  node?: PublicUser
}

export default createReducer<PublicUserReducerState>(
  {
    [String(fetchPublicUser)]: (
      _,
      action: PromiseAction<PublicUser, FetchPublicUserMeta>,
    ) => ({
      slug: action.meta.slug,
      fetching: action.pending,
      node: action.error ? undefined : (action.payload as PublicUser),
    }),
  },
  {},
)
