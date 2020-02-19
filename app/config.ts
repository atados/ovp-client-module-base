import { SearchOption } from '~/components/SearchForm/SearchForm'
import { DeepPartial } from 'ts-essentials'
import * as Sentry from '@sentry/browser'
import { ValidPageName } from '~/app'

export type ValidBasePageName =
  | 'Home'
  | 'Project'
  | 'Organization'
  | 'NewAccount'
  | 'Cause'
  | 'Login'
  | 'Search'
  | 'SearchProjects'
  | 'City'
  | 'SearchOrganizations'
  | 'Inbox'
  | 'FAQ'
  | 'FAQQuestion'
  | 'ProjectDashboard'
  | 'OrganizationDashboardProject'
  | 'OrganizationDashboardProjectsList'
  | 'OrganizationDashboardMembers'
  | 'OrganizationProjects'
  | 'OrganizationAbout'
  | 'OrganizationEdit'
  | 'OrganizationJoin'
  | 'OrganizationNewProject'
  | 'OrganizationEditProject'
  | 'OrganizationDuplicateProject'
  | 'OrganizationProjectNewPost'
  | 'OrganizationProjectEditPost'
  | 'ProjectNewPost'
  | 'ProjectEditPost'
  | 'NewOrganization'
  | 'OrganizationOnboarding'
  | 'NewProject'
  | 'EditProject'
  | 'DuplicateProject'
  | 'PublicUser'
  | 'RecoverPassword'
  | 'PrivacyTerms'
  | 'VolunteerTerms'
  | 'UsageTerms'
  | 'ApprovalTerms'
  | 'TermsList'
  | 'Viewer'
  | 'ForgotPassword'
  | 'ViewerProjectDashboard'
  | 'ViewerProjects'
  | 'ViewerSettings'
  | 'ViewerDeleteAccount'
  | 'ViewerSettingsNewsletter'
  | 'ViewerOrganizations'
  | 'ViewerSettingsPassword'
  | 'ConfirmEmail'
  | '_Facebook'
  | '_Google'

export interface AppConfiguration<TValidPageName extends string> {
  id: string
  theme: {
    color: {
      [colorName: string]: {
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
      }
    }
  }
  pages: {
    [pageName in TValidPageName]: {
      pathname: string
      filename: string
      query?: object
    }
  }
  search?: {
    defaultOptions?: SearchOption[]
    showMapByDefault: boolean
  }

  progressBar?: {
    color?: string
  }
  assets: {
    logoDark?: string
    logoLight?: string
    favicon?: string
  }
  social: Array<{
    kind: 'facebook' | 'github' | 'instagram'
    url: string
  }>
  head: {
    links: Array<{ href: string }>
    scripts: Array<{ href: string }>
  }
  supportURL?: string
  user: {
    createProject: boolean
  }
  project: {
    galleries: boolean
    posts: boolean
    documents: boolean
    documentsRestricted: boolean
  }

  application: {
    require: {
      emailConfirmation: boolean
    }
  }

  toolbar: {
    brand?: string
    background?: string
    height: number
    links: Array<{ href: string; as?: string; label: string }>
  }
  footer: {
    links: Array<{ href: string; as?: string; label: string }>
    theme?: 'dark' | 'light'
    background?: string
    brand?: string
  }
  popover: {
    backgroundColor?: string
  }
  googleTagManager?: {
    id: string
  }
  maps?: {
    key: string
  }
  chat: {
    enabled: boolean
    beta: boolean
  }
  organization: {
    enabled: boolean
  }
  geolocation: {
    default: {
      countryCode: string
      regionCode: string
      latitude: number
      longitude: number
    }
    filterSearchByDefault: boolean
  }
  emailConfirmation: {
    warning: boolean
  }
  sentry?: Sentry.BrowserOptions
  volunteer: {
    showHours: boolean
  }
  intl: {
    editable: boolean
    defaultTo: 'accept-language' | 'none'
  }
}

export type Configuration = DeepPartial<AppConfiguration<ValidPageName>>
