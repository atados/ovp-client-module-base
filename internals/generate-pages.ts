import path from 'path'
import { RequiredPagesMap, Channel } from '../common'
import loadChannelConfig from './channel/load-channel-config'
import { promisify } from 'util'
import * as fs from 'fs'
import mkdirp from 'mkdirp'

// @ts-ignore
const writeFile = promisify(fs.writeFile)
// @ts-ignore
const createDir = promisify(mkdirp)

type PagesBuilderMap = {
  [pageName in keyof RequiredPagesMap]:
    | string
    | {
        importPath: string
        query: object
      }
}

const PageBuildShape: PagesBuilderMap = {
  Home: '~/base/pages/home',
  Project: '~/base/pages/project',
  Organization: '~/base/pages/organization',
  NewAccount: {
    importPath: '~/base/pages/authentication',
    query: {
      defaultPage: 'new-account',
    },
  },
  Cause: '~/base/pages/cause',
  Login: '~/base/pages/authentication',
  Search: '~/base/pages/explore',
  SearchProjects: {
    importPath: '~/base/pages/explore',
    query: {
      searchType: '1',
    },
  },
  SearchOrganizations: {
    importPath: '~/base/pages/explore',
    query: {
      searchType: '2',
    },
  },
  Inbox: '~/base/pages/inbox',
  FAQ: '~/base/pages/faq',
  FAQQuestion: '~/base/pages/faq-question',
  ProjectDashboard: '~/base/pages/manage-project',
  OrganizationDashboardProject: '~/base/pages/manage-project',
  OrganizationDashboardProjectsList: '~/base/pages/manageable-projects-list',
  OrganizationDashboardMembers: '~/base/pages/organization-members',
  OrganizationProjects: '~/base/pages/organization-projects',
  OrganizationEdit: '~/base/pages/organization-composer',
  OrganizationJoin: '~/base/pages/organization-join',
  OrganizationNewProject: '~/base/pages/project-composer',
  OrganizationEditProject: {
    importPath: '~/base/pages/project-composer',
    query: {
      mode: 'EDIT',
    },
  },
  OrganizationDuplicateProject: '~/base/pages/project-composer',
  OrganizationProjectNewPost: '~/base/pages/post-form',
  OrganizationProjectEditPost: '~/base/pages/post-form',
  ProjectNewPost: '~/base/pages/post-form',
  ProjectEditPost: '~/base/pages/post-form',
  NewOrganization: '~/base/pages/organization-composer',
  NewProject: '~/base/pages/project-composer',
  EditProject: {
    importPath: '~/base/pages/project-composer',
    query: {
      mode: 'EDIT',
    },
  },
  DuplicateProject: '~/base/pages/project-composer',
  PublicUser: '~/base/pages/public-user',
  RecoverPassword: '~/base/pages/recover-password',
  PrivacyTerms: '~/base/pages/privacy-terms',
  VolunteerTerms: '~/base/pages/volunteer-terms',
  UsageTerms: '~/base/pages/volunteer-terms',
  ApprovalTerms: '~/base/pages/approval-terms',
  TermsList: '~/base/pages/terms-list',
  Viewer: '~/base/pages/viewer',
  ForgotPassword: '~/base/pages/new-password-recovery-request',
  ViewerProjectDashboard: '~/base/pages/manage-project',
  ViewerProjects: '~/base/pages/manageable-projects-list',
  ViewerSettings: '~/base/pages/settings-user',
  ViewerOrganizations: '~/base/pages/settings-organizations',
  ViewerSettingsPassword: '~/base/pages/settings-password',
}

const nextPages = ['_app', '_document', '_error']
async function generateNextPages() {
  return nextPages.map(nextPage => {
    const filepath = path.resolve('pages', `${nextPage}.tsx`)
    try {
      fs.statSync(filepath)
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(`> Created ${nextPage}.tsx`)
      return writeFile(
        filepath,
        `export { default } from '~/base/pages/${nextPage}'`,
      )
    }
  })
}

export default async function generatePageFiles() {
  await createDir(path.resolve('pages'))
  await generateNextPages()

  const channel: Channel = loadChannelConfig()
  const pageNames = Object.keys(channel.pages)
  const pagesPathNames = Object.values(channel.pages)

  let absolutePagesPathnames: string[] = []
  pagesPathNames.sort().forEach(pathname => {
    absolutePagesPathnames = absolutePagesPathnames.filter(
      absolutePagePathname => {
        return !pathname.startsWith(absolutePagePathname)
      },
    )
    absolutePagesPathnames.push(pathname)
  })

  return Promise.all(
    pageNames.map(async (pageName: keyof RequiredPagesMap) => {
      const pathname = channel.pages[pageName]
      const pageBuildShape = PageBuildShape[pageName]
      const relativeFilePath =
        pathname === '/'
          ? 'index.tsx'
          : absolutePagesPathnames.includes(pathname)
          ? `${pathname.substr(1)}.tsx`
          : `${pathname.substr(1)}/index.tsx`
      const output = path.resolve('pages', relativeFilePath)
      // tslint:disable-next-line:no-console
      console.log(`> Created ${relativeFilePath}`)
      await createDir(path.dirname(output))
      await writeFile(
        output,
        typeof pageBuildShape === 'string'
          ? `export { default } from '${pageBuildShape}'`.trim()
          : `
import Page from '${pageBuildShape.importPath}'
import { withQuery } from '~/base/lib/utils/next'

export default withQuery(
  Page as any,
  ${JSON.stringify(pageBuildShape.query, null, 2)})
      `.trim(),
      )
    }),
  )
}
