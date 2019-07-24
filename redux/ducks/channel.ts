import { SearchOption } from '~/components/SearchForm/SearchForm'

export interface ImageDict {
  id: number
  image_url: string
  small_image_url: string
  medium_image_url: string
  image_medium: string
}

export interface Skill {
  id: number
  name: string
}

export interface Cause {
  id: number
  name: string
  slug: string
  color: string
  image?: ImageDict
}

export interface Channel {
  id: string
  theme: ChannelTheme
  search?: {
    defaultSearchOptions?: SearchOption[]
  }
  stats: {
    volunteers: number
    organizations: number
  }
  assets: {
    toolbarBrand?: string
    footerBrand?: string
    icon?: string
    links: Array<{ href: string }>
    scripts: Array<{ href: string }>
  }
  social: Array<{
    kind: 'facebook' | 'github' | 'instagram'
    url: string
  }>
  config: {
    search: {
      // FIXME: Define defaultOptions
      defaultOptions: any
    }
    supportURL?: string
    tour: boolean
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
    wpBlogUrl?: string
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
  }
  geo: {
    regions: string[]
    default: {
      region: string
      lat: number
      lng: number
    }
  }
  integrations?: Array<{
    channelId: string
    apiUri: string
  }>
}

export interface ChannelTheme {
  iconRating: string
  colorPrimary: string
  colorSecondary: string
  primaryButtonBackground?: string
  darkIcons?: boolean
  toolbarBackground?: string
  toolbarHeight: number
  toolbarTheme?: string
  footerBackground?: string
  footerTheme?: 'dark' | 'light'
}
