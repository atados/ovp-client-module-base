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
  Home: '~/pages/home',
  Project: '~/pages/project',
  Organization: '~/pages/organization',
  NewAccount: {
    importPath: '~/pages/authentication',
    query: {
      defaultPage: 'new-account',
    },
  },
  Cause: '~/pages/cause',
  Login: '~/pages/authentication',
  Search: '~/pages/explore',
  SearchProjects: {
    importPath: '~/pages/explore',
    query: {
      searchType: '1',
    },
  },
  SearchOrganizations: {
    importPath: '~/pages/explore',
    query: {
      searchType: '2',
    },
  },
  Inbox: '~/pages/inbox',
  FAQ: '~/pages/faq',
  FAQQuestion: '~/pages/faq-question',
  ProjectDashboard: '~/pages/manage-project',
  OrganizationDashboardProject: '~/pages/manage-project',
  OrganizationDashboardProjectsList: '~/pages/manageable-projects-list',
  OrganizationDashboardMembers: '~/pages/organization-members',
  OrganizationProjects: '~/pages/organization-projects',
  OrganizationAbout: '~/pages/organization-about',
  OrganizationEdit: '~/pages/organization-edit',
  OrganizationJoin: '~/pages/organization-join',
  OrganizationNewProject: '~/pages/project-composer',
  OrganizationEditProject: {
    importPath: '~/pages/project-composer',
    query: {
      mode: 'EDIT',
    },
  },
  OrganizationDuplicateProject: '~/pages/project-composer',
  OrganizationProjectNewPost: '~/pages/post-form',
  OrganizationProjectEditPost: '~/pages/post-form',
  ProjectNewPost: '~/pages/post-form',
  ProjectEditPost: '~/pages/post-form',
  NewOrganization: '~/pages/organization-composer',
  NewProject: '~/pages/project-composer',
  EditProject: {
    importPath: '~/pages/project-composer',
    query: {
      mode: 'EDIT',
    },
  },
  DuplicateProject: '~/pages/project-composer',
  PublicUser: '~/pages/public-user',
  RecoverPassword: '~/pages/recover-password',
  PrivacyTerms: '~/pages/privacy-terms',
  VolunteerTerms: '~/pages/volunteer-terms',
  UsageTerms: '~/pages/volunteer-terms',
  ApprovalTerms: '~/pages/approval-terms',
  TermsList: '~/pages/terms-list',
  Viewer: '~/pages/viewer',
  ForgotPassword: '~/pages/new-password-recovery-request',
  ViewerProjectDashboard: '~/pages/manage-project',
  ViewerProjects: '~/pages/manageable-projects-list',
  ViewerSettings: '~/pages/settings-user',
  ViewerOrganizations: '~/pages/settings-organizations',
  ViewerSettingsPassword: '~/pages/settings-password',
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
        `export { default } from '~/pages/${nextPage}'`,
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

      try {
        fs.statSync(output)
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(`> Created ${relativeFilePath}`)
        await createDir(path.dirname(output))
        await writeFile(
          output,
          typeof pageBuildShape === 'string'
            ? `export { default } from '${pageBuildShape}'`.trim()
            : `
import Page from '${pageBuildShape.importPath}'
import { withQuery } from '~/lib/utils/next'

export default withQuery(
  Page as any,
  ${JSON.stringify(pageBuildShape.query, null, 2)})
      `.trim(),
        )
      }
    }),
  )
}
