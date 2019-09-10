import { ImageDict } from '~/common/channel'

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
