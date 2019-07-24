import isEqual from 'fast-deep-equal'
import querystring from 'query-string'
import { createAction, createReducer } from 'redux-handy'
import { channel } from '~/common/constants'
import { fetchJSON } from '~/lib/fetch/fetch.client'
import { RootState } from '../root-reducer'

interface FetchBlogFilters {
  per_page?: number
}

export const fetchBlogPosts = createAction<
  FetchBlogFilters | undefined,
  BlogPost[],
  { filters?: FetchBlogFilters }
>(
  'BLOG_FETCH',
  (filters, { getState }) => {
    const { blog: currentState } = getState() as RootState

    if (currentState.fetched && isEqual(filters, currentState.filters)) {
      return currentState.nodes
    }

    if (!channel.config.wpBlogUrl) {
      return []
    }

    return fetchJSON(
      `${channel.config.wpBlogUrl}/wp-json/wp/v2/posts?${querystring.stringify({
        per_page: 4,
        ...filters,
      })}`,
    )
  },
  filters => ({ filters }),
)

export interface BlogPost {
  id: number
  date: string
  date_gmt: string
  guid: Guid
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: Guid
  content: Content
  excerpt: Content
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any[]
  categories: number[]
  tags: any[]
  better_featured_image: Betterfeaturedimage
  _links: Links
}

interface Links {
  self: Self[]
  collection: Self[]
  about: Self[]
  author: Author[]
  replies: Author[]
  'version-history': Self[]
  'wp:featuredmedia': Author[]
  'wp:attachment': Self[]
  'wp:term': Wpterm[]
  curies: Cury[]
}

interface Cury {
  name: string
  href: string
  templated: boolean
}

interface Wpterm {
  taxonomy: string
  embeddable: boolean
  href: string
}

interface Author {
  embeddable: boolean
  href: string
}

interface Self {
  href: string
}

interface Betterfeaturedimage {
  id: number
  alt_text: string
  caption: string
  description: string
  media_type: string
  media_details: Mediadetails
  post: number
  source_url: string
}

interface Mediadetails {
  width: number
  height: number
  file: string
  sizes: Sizes
  image_meta: Imagemeta
}

interface Imagemeta {
  aperture: string
  credit: string
  camera: string
  caption: string
  created_timestamp: string
  copyright: string
  focal_length: string
  iso: string
  shutter_speed: string
  title: string
  orientation: string
  keywords: any[]
}

interface Sizes {
  thumbnail: Thumbnail
  medium: Thumbnail
  medium_large?: Thumbnail
  large?: Thumbnail
  'ebor-admin-list-thumb': Thumbnail
}

interface Thumbnail {
  file: string
  width: number
  height: number
  'mime-type': string
  source_url: string
}

interface Content {
  rendered: string
  protected: boolean
}

interface Guid {
  rendered: string
}

export interface BlogReducerState {
  nodes: BlogPost[]
  catalogueSlug?: string
  fetched?: boolean
  fetching?: boolean
  filters?: FetchBlogFilters
}

export default createReducer<BlogReducerState>(
  {
    [String(fetchBlogPosts)]: (state, action) => ({
      catalogueSlug: action.meta.slug,
      filters: action.meta.filters,
      fetching: action.pending,
      fetched: !action.pending,
      nodes: action.error ? state.nodes : (action.payload as BlogPost[]) || [],
    }),
  },
  { nodes: [] },
)
