import { ImageDict } from '~/common/channel'
import { Project, ProjectApplication, ProjectRole } from '~/redux/ducks/project'
import { Organization } from '~/redux/ducks/organization'
import { UserOrganization } from '~/redux/ducks/user'

export {
  Project,
  ProjectApplication,
  ProjectRole,
  Organization,
  UserOrganization,
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
