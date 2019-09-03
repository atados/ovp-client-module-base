import { channel } from '../common/constants'
import { RequiredPagesMap } from '../redux/ducks/channel'

export const Page: RequiredPagesMap = channel.pages

interface ArgFormatKeys {
  [key: string]: string | number | boolean
}

type PageAsMapFn = {
  [key in keyof RequiredPagesMap]: (formatKeys?: ArgFormatKeys) => string
}

export const PageAs: PageAsMapFn = {} as PageAsMapFn

const format = (page: string, obj?: ArgFormatKeys) =>
  page.replace(/\[([^\]]+)\]/g, (_, key) =>
    String((obj && obj[key]) || `[${key}]`),
  )

Object.keys(Page).forEach(key => {
  PageAs[key as keyof RequiredPagesMap] = (formatKeys?: ArgFormatKeys) =>
    format(Page[key as keyof RequiredPagesMap], formatKeys)
})
