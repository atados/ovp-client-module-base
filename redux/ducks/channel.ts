import * as Sentry from '@sentry/browser'
import { SearchOption } from '~/components/SearchForm/SearchForm'
import { ColorMap } from '~/base/types/global'

export interface ImageDict {
  id: number
  image_url: string
  small_image_url: string
  medium_image_url: string
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

export interface Channel {
  id: string
  theme: ChannelTheme
  search?: {
    defaultSearchOptions?: SearchOption[]
  }
  stats: {
    volunteers: number
    organizations: number
  }
  assets: {
    brand?: string
    toolbarBrand?: string
    footerBrand?: string
    icon?: string
    links: Array<{ href: string }>
    scripts: Array<{ href: string }>
  }
  social: Array<{
    kind: 'facebook' | 'github' | 'instagram'
    url: string
  }>
  pages: RequiredPagesMap
  config: ChannelConfig

  integrations?: Array<{
    channelId: string
    apiUri: string
  }>
}

export interface RequiredPagesMap {
  Home: string
  Project: string
  Organization: string
  Cause: string
  Login: string
  Search: string
  SearchProjects: string
  SearchOrganizations: string
  Inbox: string
  FAQ: string
  FAQQuestion: string
  ProjectDashboard: string
  OrganizationDashboardProject: string
  OrganizationDashboardProjectsList: string
  OrganizationDashboardMembers: string
  OrganizationProjects: string
  OrganizationEdit: string
  OrganizationJoin: string
  OrganizationNewProject: string
  NewOrganization: string
  NewProject: string
  PublicUser: string
  RecoverPassword: string
  SettingsOrganizations: string
  SettingsPassword: string
  SettingsUser: string
  PrivacyTerms: string
  VolunteerTerms: string
  UsageTerms: string
  ApprovalTerms: string
  TermsList: string
  Viewer: string
}

export interface ChannelTheme {
  color: {
    [colorName: string]: ColorMap
  }
  iconRating: string
  primaryButtonBackground?: string
  darkIcons?: boolean
  toolbarBackground?: string
  toolbarHeight: number
  toolbarTheme?: string
  footerBackground?: string
  footerTheme?: 'dark' | 'light'
}

export interface ChannelConfig {
  search: {
    defaultOptions: any
  }
  supportURL?: string
  tour: boolean
  user: {
    createProject: boolean
  }
  project: {
    galleries: boolean
    posts: boolean
    documents: boolean
    documentsRestricted: boolean
  }
  toolbar: {
    links: Array<{ href: string; as?: string; label: string }>
  }
  footer: {
    links: Array<{ href: string; as?: string; label: string }>
  }
  wpBlogUrl?: string
  googleTagManager?: {
    id: string
  }
  maps: {
    key: string
  }
  chat: {
    enabled: boolean
    beta: boolean
  }
  organization: {
    enabled: boolean
  }
  geo: {
    regions: string[]
    default: {
      region: string
      lat: number
      lng: number
    }
  }
  sentry: Sentry.BrowserOptions
}
