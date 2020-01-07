import { NextPage } from 'next'
import Router from 'next/router'
import queryString from 'querystring'
import React, { useCallback, useRef, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import ActivityIndicator from '~/components/ActivityIndicator'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import useFetchAPI from '~/hooks/use-fetch-api'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import { NotFoundPageError } from '~/lib/next/errors'
import { Project } from '~/redux/ducks/project'
import { ApiPagination } from '~/redux/ducks/search'
import { UserOrganization } from '~/redux/ducks/user'
import { useIntl, defineMessages } from 'react-intl'
import Meta from '../components/Meta'
import ManageableProjectTableRow from '../components/ManageableProjectsListPage/ManageableProjectTableRow'
import { removeSearchFragmentFromURL } from '../lib/utils/string'
import { useFetchClient } from 'react-fetch-json-hook'

const PageStyled = styled.div`
  min-height: 100vh;
`

const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Table = styled.table`
  max-width: 100%;
  min-width: 800px;
`

const FiltersForm = styled.form`
  display: flex;
`

const SearchForm = styled.div`
  position: relative;
  flex: 1 1 auto;

  > input {
    padding-left: 38px;
  }

  > .icon {
    position: absolute;
    left: 12px;
    top: 6px;
    color: ${channel.theme.color.primary[500]};
    font-size: 20px;
  }
`

const ClosedFilterInput = styled.select`
  width: 230px;
  font-weight: 500;
`

const m = defineMessages({
  title: {
    id: 'pages.manageableProjectList.title',
    defaultMessage: 'Gerenciar vagas',
  },
  searchPlaceholder: {
    id: 'pages.manageableProjectList.searchPlaceholder',
    defaultMessage: 'Buscar vagas',
  },
  filterAll: {
    id: 'pages.manageableProjectList.filter.all',
    defaultMessage: 'Todas as vagas',
  },
  filterOpen: {
    id: 'pages.manageableProjectList.filter.open',
    defaultMessage: 'Apenas vagas abertas',
  },
  filterClosed: {
    id: 'pages.manageableProjectList.filter.closed',
    defaultMessage: 'Apenas vagas fechadas',
  },
  filterPublished: {
    id: 'pages.manageableProjectList.filter.published',
    defaultMessage: 'Apenas vagas publicadas',
  },
  filterRevision: {
    id: 'pages.manageableProjectList.filter.revision',
    defaultMessage: 'Apenas vagas em revisão',
  },
  manageProject: {
    id: 'pages.manageableProjectList.manageProject',
    defaultMessage: 'Gerenciar vaga',
  },
  editProject: {
    id: 'pages.manageableProjectList.editProject',
    defaultMessage: 'Editar vaga',
  },
  duplicateProject: {
    id: 'pages.manageableProjectList.duplicateProject',
    defaultMessage: 'Duplicar vaga',
  },
  viewProject: {
    id: 'pages.manageableProjectList.viewProject',
    defaultMessage: 'Visualizar vaga',
  },
  loading: {
    id: 'CARREGANDO',
    defaultMessage: 'Carregando...',
  },
  projectsCount: {
    id: 'pages.manageableProjectList.projectsCount',
    defaultMessage: '{value} vagas no total',
  },
  loadingProjects: {
    id: 'pages.manageableProjectList.loadingProjects',
    defaultMessage: 'Carregando vagas...',
  },
  noProjects: {
    id: 'pages.manageableProjectList.noProjects',
    defaultMessage: 'Não há mais vagas',
  },
})

interface ManageableProjectsListProps {
  readonly organization?: UserOrganization
  readonly filters: {
    query: string
    status: 'both' | 'false' | 'true' | 'published' | 'unpublished'
  }
}

const ManageableProjectsList: NextPage<ManageableProjectsListProps> = ({
  organization,
  filters,
}) => {
  const intl = useIntl()
  const [searchInputValue, setSearchInputValue] = useState<string>(
    filters.query,
  )

  const fetchClient = useFetchClient()
  const queryResult = useFetchAPI<ApiPagination<Project>>(
    `/search/projects/?${queryString.stringify({
      ordering: '-created_date',
      manageable: organization ? undefined : 'true',
      published:
        filters.status === 'published' || filters.status === 'unpublished'
          ? String(filters.status === 'published')
          : 'both',
      closed:
        filters.status === 'published'
          ? 'both'
          : filters.status === 'unpublished'
          ? 'false'
          : filters.status,
      query: filters.query,
      organization: organization ? organization.id : undefined,
    })}`,
    {
      id: 'manageable-projects',
    },
  )
  const fetchMoreProjectsMutation = useFetchAPIMutation<ApiPagination<Project>>(
    (nextURL: string) => ({
      endpoint: nextURL.substr(nextURL.indexOf('/search') - 7),
    }),
  )

  const projects: Project[] = queryResult.data?.results || []
  const handleLoadMoreProjectsCallback = useCallback(async () => {
    const nextURL = queryResult.data?.next
    const prevResult = queryResult.data

    if (nextURL && prevResult) {
      const { data: nextResult } = await fetchMoreProjectsMutation.mutate()

      if (!nextResult) {
        return
      }

      fetchClient.set('manageable-projects', {
        ...prevResult,
        next: nextResult.next,
        results: [...prevResult.results, ...nextResult.results],
      })
    }
  }, [])

  const searchInputDebounceRef = useRef<number | null>(null)
  const handleSearchInputChange = useCallback(
    event => {
      const { value } = event.target
      setSearchInputValue(value)

      if (searchInputDebounceRef.current) {
        clearTimeout(searchInputDebounceRef.current)
      }

      searchInputDebounceRef.current = window.setTimeout(() => {
        Router.push(
          `${Router.pathname}?${queryString.stringify({
            organizationSlug: organization && organization.slug,
            closed: filters.status,
            query: value,
          })}`,
          `${Router.asPath!.split('?')[0]}?${queryString.stringify({
            closed: filters.status,
            query: value,
          })}`,
        )
      }, 200)
    },
    [setSearchInputValue],
  )

  const handleClosedFilterInputChange = useCallback(event => {
    const { value } = event.target

    const searchFragment = queryString.stringify({
      closed: value,
      query: filters.query,
    })
    Router.push(
      `${Router.pathname}?${searchFragment}`,
      `${removeSearchFragmentFromURL(Router.asPath!)}?${searchFragment}`,
    )
  }, [])

  const body = (
    <div className="container px-2 py-5">
      <Meta title={intl.formatMessage(m.title)} />
      <div className="rounded-lg bg-white shadow">
        <div className="px-5 py-4 rounded-t-lg">
          <h1 className="text-2xl font-medium">
            {intl.formatMessage(m.title)}
          </h1>
          <span className="mb-6 block text-gray-600">
            {queryResult.data
              ? intl.formatMessage(m.projectsCount, {
                  value: queryResult.data.count,
                })
              : intl.formatMessage(m.loading)}
          </span>
          <FiltersForm>
            <SearchForm className="mr-2">
              <input
                type="text"
                className="input h-10 rounded-full"
                placeholder={intl.formatMessage(m.searchPlaceholder)}
                onChange={handleSearchInputChange}
                value={searchInputValue}
              />
              <Icon name="search" />
            </SearchForm>
            <ClosedFilterInput
              className="input h-10 rounded-full px-4"
              value={filters.status}
              onChange={handleClosedFilterInputChange}
            >
              <option value="both">{intl.formatMessage(m.filterAll)}</option>
              <option value="false">{intl.formatMessage(m.filterOpen)}</option>
              <option value="true">{intl.formatMessage(m.filterClosed)}</option>
              <option value="published">
                {intl.formatMessage(m.filterPublished)}
              </option>
              <option value="unpublished">
                {intl.formatMessage(m.filterRevision)}
              </option>
            </ClosedFilterInput>
          </FiltersForm>
        </div>
        <TableWrapper>
          <Table className="table table-default borderless">
            <tbody>
              {projects.map(project => (
                <ManageableProjectTableRow
                  key={project.slug}
                  project={project}
                  fromOrganization={organization}
                />
              ))}
            </tbody>
          </Table>
        </TableWrapper>
        {(queryResult.loading || queryResult.data?.next) && (
          <div className="card-item p-5 text-center">
            <Waypoint onEnter={handleLoadMoreProjectsCallback} />
            <ActivityIndicator size={64} className="mb-2" />
            <span className="block text-gray-600">
              {intl.formatMessage(m.loadingProjects)}
            </span>
          </div>
        )}
        {!queryResult.loading && queryResult.data?.next && (
          <div className="card-item p-5 text-center text-gray-600">
            {intl.formatMessage(m.noProjects)}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <PageStyled className="bg-muted">
      {organization ? (
        <OrganizationLayout
          layoutProps={{ disableFooter: true }}
          isViewerMember
          organization={organization}
        >
          {body}
        </OrganizationLayout>
      ) : (
        <Layout disableFooter>{body}</Layout>
      )}
    </PageStyled>
  )
}

ManageableProjectsList.displayName = 'ManageableProjectsList'
ManageableProjectsList.getInitialProps = async ({ store, query }) => {
  const { user } = store.getState()
  const organizationSlug = query.organizationSlug
    ? String(query.organizationSlug)
    : undefined
  const organization: UserOrganization | undefined =
    user && organizationSlug
      ? user.organizations.find(
          organizationItem => organizationItem.slug === organizationSlug,
        )
      : undefined

  if (organizationSlug && !organization) {
    throw new NotFoundPageError()
  }

  return {
    organization,
    filters: {
      status:
        query.closed === 'false' ||
        query.closed === 'published' ||
        query.closed === 'unpublished' ||
        query.closed === 'both' ||
        query.closed === 'true'
          ? query.closed
          : 'both',
      query: query.query ? String(query.query) : '',
    },
  }
}

export default ManageableProjectsList
