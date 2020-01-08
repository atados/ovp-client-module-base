import path from 'path'
import { Channel, PageName } from '../common'
import loadChannelConfig from './channel/load-channel-config'
import { promisify } from 'util'
import * as fs from 'fs'
import mkdirp from 'mkdirp'
import defaultPages from './pages.default.json'
import * as prettier from 'prettier'
import prettierConfig from '../../.prettierrc.json'

const writeFile = promisify(fs.writeFile)
const createDir = promisify(mkdirp)

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
  const pagesBuildShapeMap = { ...defaultPages }

  if (channel.pages) {
    Object.keys(channel.pages).forEach(pageName => {
      pagesBuildShapeMap[pageName] = {
        ...pagesBuildShapeMap[pageName],
        ...channel.pages[pageName],
      }
    })
  }

  const pageNames = Object.keys(pagesBuildShapeMap)

  let absolutePagesPathnames: string[] = []
  pageNames
    .map(pageName => pagesBuildShapeMap[pageName].pathname)
    .sort()
    .forEach(pathname => {
      absolutePagesPathnames = absolutePagesPathnames.filter(
        absolutePagePathname => {
          return !pathname.startsWith(absolutePagePathname)
        },
      )
      absolutePagesPathnames.push(pathname)
    })

  return Promise.all(
    pageNames.map(async (pageName: PageName) => {
      const { pathname } = pagesBuildShapeMap[pageName]
      const pageShape = pagesBuildShapeMap[pageName]
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
        const { filename } = pageShape
        await writeFile(
          output,
          prettier.format(
            pageShape.query
              ? `
                import Page from '~/pages/${filename}'
                import { withQuery } from '~/lib/utils/next'

                export default withQuery(
                  Page as any,
                  ${JSON.stringify(pageShape.query, null, 2)}
                )`.trim()
              : `export { default } from '~/pages/${filename}'`.trim(),
            {
              ...prettierConfig,
              parser: 'typescript',
            },
          ),
        )
      }
    }),
  )
}
