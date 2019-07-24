import { channelPages } from './constants'

const channelPagesMap: { [pathname: string]: string } = {}

channelPages.forEach(pathname => {
  channelPagesMap[pathname] = `/channel${pathname}`
})

export function resolvePage(pathname) {
  return channelPagesMap[pathname] || `/base${pathname}`
}
