import { Config } from '~/common/config'
import { ValidPageName } from '~/app'

export type PagesMap = {
  [pageName in ValidPageName]: {
    pathname: string
    filename: string
    query?: object
  }
}

export type PagesPathnameMap = {
  [pageName in ValidPageName]: string
}

interface ArgFormatKeys {
  [key: string]: string | number | boolean | undefined
}

type PageAsMapFn = {
  [key in ValidPageName]: (formatKeys?: ArgFormatKeys) => string
}

export const Page = {} as PagesPathnameMap
export const PageAs: PageAsMapFn = {} as PageAsMapFn

const format = (page: string, obj?: ArgFormatKeys) =>
  page.replace(/\[([^\]]+)\]/g, (_, key) =>
    String(obj && obj[key] !== undefined ? obj[key] : `[${key}]`),
  )

Object.keys(Config.pages).forEach((key: ValidPageName) => {
  Page[key] = Config.pages[key].pathname
  PageAs[key] = (formatKeys?: ArgFormatKeys) => {
    return format(Config.pages[key].pathname, formatKeys)
  }
})
