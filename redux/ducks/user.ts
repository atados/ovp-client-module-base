import { Cause, Skill } from './channel'
import { editOrganization } from './organization-composer'
import { sendRating } from './ratings'
import { updateUser } from './user-update'

export interface User {
  uuid: string
  name: string
  slug: string
  token: string
  profile: UserProfile
  phone?: string
  chat_enabled?: boolean
  rating_requests_project_count: number
  rating_requests_projects_with_unrated_users: number
  organizations: UserOrganization[]
  avatar?: {
    image_small_url: string
    image_url: string
  }
}

export interface UserOrganization {
  id: number
  slug: string
  name: string
  description: string
  chat_enabled: boolean
  image?: {
    image_small_url: string
    image_url: string
  }
}

export interface UserProfile {
  color: string
  birthday_date: string
  gender: string
  causes?: Cause[]
  skills?: Skill[]
  about?: string
  address: {
    typed_address: string
  } | null
}

export type UserState = User | null

export default (user: User | null = null, action): UserState => {
  if (user && action.type === sendRating.type && !action.pending) {
    return {
      ...user,
      rating_requests_project_count:
        action.meta.type === 'project'
          ? user.rating_requests_project_count - 1
          : user.rating_requests_project_count,
      rating_requests_projects_with_unrated_users:
        action.meta.type === 'user' && action.meta.first
          ? user.rating_requests_project_count - 1
          : user.rating_requests_project_count,
    }
  }

  if (user && action.payload && action.type === editOrganization.type) {
    return {
      ...user,
      organizations: user.organizations.map(organization => {
        if (organization.id === action.payload.id) {
          return {
            ...organization,
            ...action.payload,
          }
        }

        return organization
      }),
    }
  }

  if (user && action.type === updateUser.type) {
    return {
      ...user,
      ...action.payload,
    }
  }

  return user
}
