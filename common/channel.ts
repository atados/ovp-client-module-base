import * as Sentry from '@sentry/browser'
import { SearchOption } from '~/components/SearchForm/SearchForm'
import { ColorMap } from '~/types/global'
import { MaterialIconName } from '../components/Icon/Icon'
import { PagesMap } from '~/common/page'
import ChannelValue from '~/common/channel-value'

interface ChannelAssets {
  LogoDark?: string
  LogoLight?: string
  ToolbarBrand?: string
  Favicon?: string
  FooterBrand?: string
}

interface ChannelHead {
  links: Array<{ href: string }>
  scripts: Array<{ href: string }>
}
export interface ChannelTheme {
  color: {
    [colorName: string]: ColorMap
  }
  iconRating: MaterialIconName
  primaryButtonBackground?: string
  darkIcons?: boolean
  toolbarBackground?: string
  progressBarColor?: string
  toolbarHeight: number
  toolbarTheme?: string
  footerBackground?: string
  footerTheme?: 'dark' | 'light'
}

export interface Channel {
  id: string
  emailConfirmation: {
    warning: boolean
  }
  pages: PagesMap
  theme: ChannelTheme
  search?: {
    defaultOptions?: SearchOption[]
  }
  assets: ChannelAssets
  social: Array<{
    kind: 'facebook' | 'github' | 'instagram'
    url: string
  }>
  head: ChannelHead

  useDeviceLanguage: boolean
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
  toolbar: {
    links: Array<{ href: string; as?: string; label: string }>
  }
  footer: {
    links: Array<{ href: string; as?: string; label: string }>
  }
  popover: {
    backgroundColor?: string
  }
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
      country: string
      region: string
      lat: number
      lng: number
    }
  }
  sentry: Sentry.BrowserOptions
}

const channel = ChannelValue
export const CHANNEL_ID = channel.id
export const Config = channel
export const Asset = channel.assets
export const Theme = channel.theme
export const Color = channel.theme.color
