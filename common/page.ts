import { ChannelPageName } from '~/channel-env'
import { Config } from '~/common/channel'

type BasePageName =
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

export type PageName = BasePageName | ChannelPageName
export type PagesMap = {
  [pageName in PageName]: {
    pathname: string
    filename: string
    query?: object
  }
}

export type PagesPathnameMap = {
  [pageName in PageName]: string
}

interface ArgFormatKeys {
  [key: string]: string | number | boolean | undefined
}

type PageAsMapFn = {
  [key in PageName]: (formatKeys?: ArgFormatKeys) => string
}

export const Page = {} as PagesPathnameMap
export const PageAs: PageAsMapFn = {} as PageAsMapFn

const format = (page: string, obj?: ArgFormatKeys) =>
  page.replace(/\[([^\]]+)\]/g, (_, key) =>
    String(obj && obj[key] !== undefined ? obj[key] : `[${key}]`),
  )

Object.keys(Config.pages).forEach((key: PageName) => {
  Page[key] = Config.pages[key].pathname
  PageAs[key] = (formatKeys?: ArgFormatKeys) => {
    return format(Config.pages[key].pathname, formatKeys)
  }
})
