import {
  combineActions,
  createAction,
  createReducer,
  PromiseAction,
} from 'redux-handy'
import { getRandomColor } from '~/lib/color/manager'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { ReduxState } from '../root-reducer'
import { unbookmark } from './bookmark'
import {
  ApplicationMeta,
  applyToProject,
  unapplyFromProject,
} from './project-application'
import { PublicUser, PublicUserApplication } from './public-user'
import { NodeKind } from './search'
import { updateUser } from './user-update'

export const fetchCurrentUserProfile = createAction<undefined, PublicUser>(
  'CURRENT_USER_PROFILE_FETCH',
  async (_, { prevent, getState }) => {
    const {
      user,
      startup: { causes },
      publicUser: currentPublicUserState,
      currentUserProfile,
    } = getState() as ReduxState

    if (!user) {
      throw new Error('You must be logged in to fetch current user profile')
    }

    if (currentUserProfile.node) {
      prevent()

      return currentUserProfile.node
    }

    if (
      user &&
      currentPublicUserState.node &&
      currentPublicUserState.slug === user.slug
    ) {
      return currentPublicUserState.node
    }

    const publicUser = await fetchAPI<PublicUser>(
      `/public-users/${user.slug}/`,
      {
        sessionToken: user ? user.token : undefined,
      },
    )

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
    publicUser.profile.causes = causes.filter(
      cause => causesIds.indexOf(cause.id) !== -1,
    )

    return publicUser
  },
)

export interface CurrentUserProfileState {
  slug?: string
  fetching?: boolean
  node?: PublicUser
}

export default createReducer<CurrentUserProfileState>(
  {
    [String(unbookmark)]: (state, action) => {
      if (
        state.node &&
        action.payload &&
        !action.error &&
        action.meta.nodeKind === NodeKind.Project
      ) {
        return {
          ...state,
          node: {
            ...state.node,
            bookmarked_projects: state.node.bookmarked_projects.filter(
              bookmark => bookmark.project.slug !== action.meta.slug,
            ),
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
        const node: PublicUser = {
          ...state.node,
        }

        if (applied) {
          const application = action.payload as PublicUserApplication
          node.applies = [application, ...node.applies]
        } else {
          node.applies = node.applies.filter(
            a => !a.project || a.project.slug !== action.meta.projectSlug,
          )
        }

        return {
          ...state,
          node,
        }
      }

      return state
    },
    [combineActions(String(fetchCurrentUserProfile), String(updateUser))]: (
      state,
      action: PromiseAction<PublicUser>,
    ) => {
      if (action.type === updateUser.type && !state.node) {
        return state
      }

      return {
        fetching: action.pending,
        node: action.error
          ? state.node
          : state.node
          ? {
              ...state.node,
              ...(action.payload as PublicUser),
            }
          : (action.payload as PublicUser),
      }
    },
  },
  {},
)
