import isEqual from 'fast-deep-equal'
import { combineActions, createAction, createReducer } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { RootState } from '../root-reducer'
import { Project } from './project'

export interface RatingUser {
  uuid: string
  created_date: string
  rated_object: {
    uuid: string
    name: string
    avatar: { image_url: string } | null
    slug: string
  }
  object_type: 'user'
  rating_parameters: RatingParameter[]
}

export interface RatingProject {
  uuid: string
  created_date: string
  rated_object: Project
  object_type: 'project'
  rating_parameters: RatingParameter[]
}

export type Rating = RatingUser | RatingProject

interface RatingParameter {
  slug: string
  description: string
  type: string
}

interface RatingsFilters {
  object_type?: 'user' | 'project'
  initiator_project_slug?: string
}

export const fetchRatings = createAction<
  RatingsFilters,
  Rating[],
  { filters: RatingsFilters }
>(
  'RATINGS_FETCH',
  (filters, { getState, prevent }) => {
    const { user, ratings: currentState } = getState() as RootState

    if (
      currentState.fetched &&
      isEqual(currentState.filters, filters) &&
      !currentState.error
    ) {
      prevent()
      return currentState.nodes
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    return fetchAPI('/ratings/', { query: filters, sessionToken: user.token })
  },
  filters => ({ filters }),
)

export const sendRating = createAction<
  {
    uuid: string
    values: { rate: number; comment?: string }
    type: string
    first?: boolean
  },
  {
    success: boolean
  },
  { type: string; first: boolean }
>(
  'RATING_SEND',
  ({ uuid, values: { rate, comment } }, { getState }) => {
    const { user } = getState()

    if (!user) {
      throw new Error('User must be logged in')
    }

    return fetchAPI(`/ratings/${uuid}/rate/`, {
      method: 'POST',
      sessionToken: user.token,
      body: {
        answers: comment
          ? [
              {
                parameter_slug: 'project-how-was-it',
                value_qualitative: comment,
              },
              {
                parameter_slug: 'project-score',
                value_quantitative: rate / 5,
              },
            ]
          : [
              {
                parameter_slug: 'volunteer-score',
                value_quantitative: rate / 5,
              },
            ],
      },
    })
  },
  ({ uuid, type, first }) => ({ uuid, type, first: Boolean(first) }),
)

export const cancelRating = createAction<
  { uuid: string; type: string; first?: boolean },
  {
    success: boolean
  },
  { type: string; first: boolean }
>(
  'RATING_CANCEL',
  ({ uuid }, { getState }) => {
    const { user } = getState()

    if (!user) {
      throw new Error('User must be logged in')
    }

    return fetchAPI(`/ratings/${uuid}/delete/`, {
      method: 'DELETE',
      sessionToken: user.token,
    })
  },
  ({ uuid, type, first }) => ({ uuid, type, first: Boolean(first) }),
)

export interface RatingsReducerState {
  readonly fetching?: boolean
  readonly fetched?: boolean
  readonly error?: Error
  readonly filters?: RatingsFilters
  readonly nodes: Rating[]
}

export default createReducer<RatingsReducerState>(
  {
    [combineActions(String(sendRating), String(cancelRating))]: (
      state,
      action,
    ) => {
      if (!action.payload && !action.error && action.meta) {
        return {
          ...state,
          nodes: state.nodes.filter(node => node.uuid !== action.meta.uuid),
        }
      }

      return state
    },
    [String(fetchRatings)]: (state, action) => ({
      fetching: action.pending,
      filters: action.meta.filters,
      nodes: action.error ? state.nodes : action.payload || state.nodes,
      error: action.error ? action.payload : undefined,
      fetched: !action.pending,
    }),
  },
  { nodes: [] },
)
