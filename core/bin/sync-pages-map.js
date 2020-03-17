const path = require('path')
const { promisify } = require('util')
const chalk = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const prettier = require('prettier')
const { writeIfNotExists } = require('../utils')
const projectPrettierConfig = require('../../../.prettierrc.json')

const writeFile = promisify(fs.writeFile)
const createDir = promisify(mkdirp)

const nextPages = ['_app', '_document', '_error']
async function createNextPages() {
  return nextPages.map(nextPage => {
    const relativeFilePath = path.join('pages', `${nextPage}.tsx`)
    writeIfNotExists(
      relativeFilePath,
      `export { default } from '~/pages/${nextPage}'`,
    )
  })
}

async function createPagesFromMap(pagesMap) {
  const pageNames = Object.keys(pagesMap)
  let absolutePagesPathnames = []

  pageNames
    .map(pageName => pagesMap[pageName].pathname)
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
    pageNames.map(async pageName => {
      const { pathname } = pagesMap[pageName]
      const pageShape = pagesMap[pageName]
      const relativeFilePath = path.join(
        'pages',
        pathname === '/'
          ? 'index.tsx'
          : absolutePagesPathnames.includes(pathname)
          ? `${pathname.substr(1)}.tsx`
          : `${pathname.substr(1)}/index.tsx`,
      )

      const { filename, query } = pageShape
      let newFileContent = ''

      if (pageShape.query) {
        newFileContent = `
            import Page from '~/pages/${filename}'
            import { withQuery } from '~/lib/utils/next'

            export default withQuery(
              Page as any,
              ${JSON.stringify(query, null, 2)}
            )
          `
      } else {
        newFileContent = `
            export { default } from '~/pages/${filename}'
          `
      }

      await writeIfNotExists(
        relativeFilePath,
        prettier.format(newFileContent, {
          ...projectPrettierConfig,
          parser: 'typescript',
        }),
      )
    }),
  )
}

async function main() {
  const config = require(path.resolve('channel', 'generated', 'app.json'))

  await createDir(path.resolve('pages'))
  await createNextPages()
  await createPagesFromMap(config.pages)
}

main()
