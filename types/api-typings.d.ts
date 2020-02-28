import { Project, ProjectApplication, ProjectRole } from '~/redux/ducks/project'
import { Organization } from '~/redux/ducks/organization'
import { UserOrganization } from '~/redux/ducks/user'
import { PublicUser } from '~/redux/ducks/public-user'

export {
  Project,
  ProjectApplication,
  ProjectRole,
  Organization,
  UserOrganization,
  PublicUser,
}

export interface ImageDict {
  id: number
  image_url: string
  image_small_url: string
  image_medium_url: string
  image_medium: string
}

export interface Skill {
  id: number
  name: string
}

export interface Cause {
  id: number
  name: string
  slug: string
  color: string
  image?: ImageDict
}

export interface DocumentDict {
  id: number
  document_url: string
}

export interface Post {
  id: number
  uuid: string
  title?: string
  content: string
  created_date: string
  modified_date: string
}

export interface OrganizationMember {
  id: number
  uuid: string
  name: string
  email: string
  avatar: ImageDict
  slug: string
}

export interface StartupPayloadStats {
  readonly volunteers: number
  readonly organizations: number
}

export interface StartupPayload {
  readonly causes: Cause[]
  readonly skills: Skill[]
  readonly stats: StartupPayloadStats
}
