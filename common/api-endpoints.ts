import { API_URL } from '~/common/constants'
import querystring from 'query-string'
import {
  AddressSearchFilter,
  mapFiltersToAPIQuery,
  NodeKind,
} from '~/redux/ducks/search'

export const QueryId = {
  ProjectApplies: (projectSlug: string) => `/projects/applies/${projectSlug}`,
}

export interface SearchProjectsParams {
  ordering?: string
  manageable?: boolean
  published?: 'both' | boolean
  closed?: 'both' | 'published' | 'unpublished' | boolean
  query?: string
  organizationId?: number | number[]
  page?: number
  page_size?: number
  categoryId?: number
}

export const SearchProjects = (params?: SearchProjectsParams) => {
  const cleanQuery: Omit<SearchProjectsParams, 'organizationId'> & {
    organization?: string
  } = {}

  if (params) {
    Object.keys(params).forEach(key => {
      if (typeof params[key] === 'undefined') {
        return
      }

      if (key === 'organizationId') {
        cleanQuery.organization = String(params.organizationId)
        return
      }

      cleanQuery[key] = params[key]
    })
  }

  return `${API_URL}/search/projects/${
    params ? `?${querystring.stringify(cleanQuery)}` : ''
  }`
}

export const ProjectApplies = (projectSlug: string) =>
  `/projects/${projectSlug}/applies/`
export const ProjectApply = (projectSlug: string, applyId: number) =>
  `/project/${projectSlug}/applies/${applyId}/`

export const Catalogue = (
  slug: string,
  filters?: {
    address?: AddressSearchFilter | null
  },
) => {
  return `${API_URL}/catalogue/${slug}/${
    filters && filters.address !== null
      ? `?${querystring.stringify(
          mapFiltersToAPIQuery(filters, NodeKind.Project) as any,
        )}`
      : ''
  }`
}
