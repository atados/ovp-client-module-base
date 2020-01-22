import * as Sentry from '@sentry/browser'
import { SearchOption } from '~/components/SearchForm/SearchForm'
import { ColorMap } from '~/types/global'
import { MaterialIconName } from '../components/Icon/Icon'
import { PagesMap } from '~/common/page'
import ChannelValue from '~/common/channel-value'

interface ChannelAssets {
  logoDark?: string
  logoLight?: string
  favicon?: string
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
  progressBarColor?: string
}

export interface Channel {
  id: string
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
  geolocation: {
    default: {
      countryCode: string
      regionCode: string
      latitude: number
      longitude: number
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
