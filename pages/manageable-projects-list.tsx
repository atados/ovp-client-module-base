import { NextPage } from 'next'
import Router from 'next/router'
import queryString from 'querystring'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import { NotFoundPageError } from '~/lib/next/errors'
import { Project } from '~/redux/ducks/project'
import { ApiPagination } from '~/redux/ducks/search'
import { UserOrganization } from '~/redux/ducks/user'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import Meta from '../components/Meta'
import ManageableProjectTableRow from '../components/ManageableProjectsListPage/ManageableProjectTableRow'
import { removeSearchFragmentFromURL } from '../lib/utils/string'
import { Theme, Color, Page, PageAs } from '../common'
import { useSWRWithExtras } from '~/hooks/use-swr'
import { APIEndpoint } from '~/common'
import ActivityIndicator from '~/components/ActivityIndicator'
import EmptySVG from '~/components/SVG/EmptySVG'
import Link from 'next/link'

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

  > input {
    padding-left: 38px;
  }

  > .icon {
    position: absolute;
    left: 12px;
    top: 6px;
    color: ${Theme.color.primary[500]};
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
  loadingProjects: {
    id: 'pages.manageableProjectList.loadingProjects',
    defaultMessage: 'Carregando vagas...',
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
  const [page, setPage] = useState<number>(1)
  const [searchInputValue, setSearchInputValue] = useState<string>(
    filters.query,
  )

  const url = APIEndpoint.SearchProjects({
    ordering: '-created_date',
    manageable: !organization,
    published:
      filters.status === 'published' || filters.status === 'unpublished'
        ? filters.status === 'published'
        : 'both',

    closed:
      filters.status === 'false' || filters.status === 'true'
        ? filters.status === 'true'
        : filters.status === 'unpublished'
        ? false
        : 'both',
    query: filters.query,
    organizationId: organization?.id,
    page,
  })

  const pagination = useSWRWithExtras<ApiPagination<Project>>(url)
  const searchInputDebounceRef = useRef<number | null>(null)
  const handleSearchInputChange = useCallback(
    event => {
      setPage(1)
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
    [setSearchInputValue, organization, filters],
  )

  const handleClosedFilterInputChange = useCallback(
    event => {
      setPage(1)
      const { value } = event.target

      const searchFragment = queryString.stringify({
        closed: value,
        query: filters.query,
      })
      Router.push(
        `${Router.pathname}?${searchFragment}`,
        `${removeSearchFragmentFromURL(Router.asPath!)}?${searchFragment}`,
      )
    },
    [filters],
  )
  const projects = pagination.data?.results || []
  const pageSize = 20
  const pagesCount = (pagination.data?.count || 0) / pageSize

  const paginationArrows = (
    <div className="w-full sm:w-1/2 md:w-1/3 mb-4 md:mb-0 flex flex-wrap justify-center md:justify-end">
      <div className="inline-block">
        {(pagination.data && (
          <span className="mr-3 mt-2 text-gray-800 block">
            {1 + (page - 1) * 20} - {Math.min(page * 20, pagination.data.count)}{' '}
            de {pagination.data.count}
          </span>
        )) || (
          <span className="mr-3 mt-2 text-gray-800 block">
            {intl.formatMessage(m.loading)}
          </span>
        )}
      </div>
      <div className="inline-block">
        <button
          type="button"
          className="btn rounded-full bg-gray-200 hover:bg-gray-300 mr-1 text-lg"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <Icon name="arrow_back" />
        </button>
        <button
          type="button"
          className="btn rounded-full bg-gray-200 hover:bg-gray-300 text-lg"
          disabled={Math.ceil(pagesCount) === page}
          onClick={() => setPage(page + 1)}
        >
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  )

  const body = (
    <div className="container px-2 py-5">
      <Meta title={intl.formatMessage(m.title)} />
      <div className="rounded-lg bg-white shadow">
        <div className="px-5 py-4 rounded-t-lg">
          <h1 className="text-2xl font-medium mb-3">
            {intl.formatMessage(m.title)}
          </h1>
          <FiltersForm className="flex flex-wrap">
            <SearchForm className="mr-0 md:mr-2 w-full sm:w-1/2 md:w-1/4 mb-4 md:mb-0">
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
              className="input h-10 rounded-full px-4 mr-0 md:mr-auto w-full sm:w-1/2 md:w-1/4 mb-4 md:mb-0"
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
            {paginationArrows}
          </FiltersForm>
        </div>
        <TableWrapper>
          {!pagination.isValidating && (
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
          )}
          {pagination.isValidating && (
            <div className="py-24 border-t text-center">
              <ActivityIndicator size={64} fill={Color.gray[700]} />
            </div>
          )}
          {!pagination.isValidating && !projects.length && (
            <div className="text-center py-10 border-t">
              <div className="max-w-lg px-4 mx-auto">
                <EmptySVG className="mx-auto w-full" height={300} />
              </div>
              <h4 className="mb-4">
                <FormattedMessage
                  id="emptyProjectsSearch"
                  defaultMessage="Nenhuma vaga foi encontrada"
                />
              </h4>
              <Link
                href={
                  organization ? Page.OrganizationNewProject : Page.NewProject
                }
                as={
                  organization
                    ? PageAs.OrganizationNewProject({
                        organizationSlug: organization.slug,
                        stepId: 'inicio',
                      })
                    : PageAs.NewProject({
                        stepId: 'inicio',
                      })
                }
              >
                <a className="btn bg-primary-500 text-white px-4 font- py-2 rounded">
                  <FormattedMessage
                    id="createProject"
                    defaultMessage="Criar vaga"
                  />
                </a>
              </Link>
            </div>
          )}
          <div className="flex flex-wrap justify-end m-2 pr-4 pb-3">
            {paginationArrows}
          </div>
        </TableWrapper>
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
      status: (query.closed === 'false' ||
      query.closed === 'published' ||
      query.closed === 'unpublished' ||
      query.closed === 'both' ||
      query.closed === 'true'
        ? query.closed
        : 'both') as ManageableProjectsListProps['filters']['status'],
      query: query.query ? String(query.query) : '',
    },
  }
}

export default ManageableProjectsList
