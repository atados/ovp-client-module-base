import moment from 'moment'
import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import queryString from 'querystring'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import styled from 'styled-components'
import { channel, dev } from '~/common/constants'
import ActivityIndicator from '~/components/ActivityIndicator'
import {
  DropdownMenu,
  DropdownToggler,
  DropdownWithContext,
} from '~/components/Dropdown'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import ProjectStatusPill from '~/components/ProjectStatusPill'
import useFetchAPI from '~/hooks/use-fetch-api'
import { NotFoundPageError } from '~/lib/next/errors'
import { Project } from '~/redux/ducks/project'
import { ApiPagination } from '~/redux/ducks/search'
import { UserOrganization } from '~/redux/ducks/user'
import { Page, PageAs } from '~/common'

const PageStyled = styled.div`
  min-height: 100vh;
`

const Card = styled.div`
  border-radius: 10px 10px 0 0;
  /* min-height: calc (full_height - toolbar_height - nav_height ) */
  min-height: calc(100vh - ${channel.theme.toolbarHeight}px - 50px);
  border-bottom-width: 0;
`

const Thumbnail = styled.figure`
  width: 72px;
  height: 72px;
  background-color: #ddd;
  border-radius: 4px;
  margin: 0;
  background-size: cover;
  background-position: center;
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

const ProjectHead = styled.div`
  padding-left: 90px;

  > a {
    color: #333;
  }

  > a > figure {
    float: left;
    margin-left: -90px;
    margin-top: 3px;
  }
`

const ClosedFilterInput = styled.select`
  width: 230px;
  border-color: transparent;
  font-weight: 500;
`

const DropdownAnchor = styled.a`
  display: block;
  padding: 7px 12px;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    background: ${channel.theme.color.primary[500]};
    color: #fff;
    text-decoration: none;
  }
`

const ContextMenu = styled(DropdownMenu)`
  left: auto;
  width: 200px;
  text-align: left;
  padding: 5px 0;
`

const Header = styled.div`
  color: #fff;
`

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
  const [searchInputValue, setSearchInputValue] = useState<string>(
    filters.query,
  )

  const queryResult = useFetchAPI<ApiPagination<Project>>(
    `/search/projects/?${queryString.stringify({
      ordering: '-created_date',
      manageable: organization ? undefined : 'true',
      published:
        filters.status === 'published' || filters.status === 'unpublished'
          ? String(filters.status === 'published')
          : 'both',
      closed:
        filters.status === 'unpublished' || filters.status === 'published'
          ? 'both'
          : filters.status,
      query: filters.query,
      organization: organization ? organization.id : undefined,
    })}`,
  )

  const projects: Project[] = useMemo(() => {
    if (queryResult.data && !queryResult.error) {
      return queryResult.data.results
    }

    return []
  }, [queryResult])

  const handleLoadMoreProjectsCallback = useCallback(() => {
    queryResult.fetchMore(result => {
      if (!result.loading && result.data && result.data.next) {
        const { next: nextPageURI } = result.data

        return {
          uri: dev ? nextPageURI : nextPageURI.replace('http://', 'https://'),
          updateData: (nextData, prevData) => ({
            ...nextData,
            next: nextData.next,
            results: [...prevData.results, ...nextData.results],
          }),
        }
      }
    })
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
          `${Router.asPath!.substr(
            0,
            Router.asPath!.indexOf('?'),
          )}?${queryString.stringify({
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

    Router.push(
      `${Router.pathname}?${queryString.stringify({
        organizationSlug: organization && organization.slug,
        closed: value,
        query: filters.query,
      })}`,
      `${Router.asPath!.substr(
        0,
        Router.asPath!.indexOf('?'),
      )}?${queryString.stringify({
        closed: value,
        query: filters.query,
      })}`,
    )
  }, [])

  const body = (
    <div className="container">
      <Card>
        <Header className="px-4 py-3 bg-primary-700">
          <h1 className="h2">Gerenciar vagas</h1>
          <span className="mb-4 block tc-light">
            {queryResult.data
              ? `${queryResult.data.count} vagas no total`
              : 'Carregando...'}
          </span>
          <FiltersForm>
            <SearchForm className="mr-2">
              <input
                type="text"
                className="input h-10 rounded-full border-transparent"
                placeholder="Buscar vagas"
                onChange={handleSearchInputChange}
                value={searchInputValue}
              />
              <Icon name="search" />
            </SearchForm>
            <ClosedFilterInput
              className="input h-10 bg-white-200 input-dark tc-white rounded-full px-3 border-transparent"
              value={filters.status}
              onChange={handleClosedFilterInputChange}
            >
              <option value="both">Todas as vagas</option>
              <option value="false">Apenas vagas abertas</option>
              <option value="true">Apenas vagas fechadas</option>
              <option value="published">Apenas vagas publicadas</option>
              <option value="unpublished">Apenas vagas em revisão</option>
            </ClosedFilterInput>
          </FiltersForm>
        </Header>
        <div className="bg-white shadow rounded-b-lg">
          <TableWrapper>
            <Table className="table table-default borderless">
              <tbody>
                {projects.map(project => (
                  <tr key={project.slug}>
                    <td className="pl-4">
                      <ProjectHead>
                        <Link
                          href={
                            organization
                              ? Page.OrganizationDashboardProject
                              : Page.ViewerProjectDashboard
                          }
                          as={
                            organization
                              ? PageAs.OrganizationDashboardProject({
                                  organizationSlug: organization.slug,
                                  projectSlug: project.slug,
                                })
                              : PageAs.ViewerProjectDashboard({
                                  projectSlug: project.slug,
                                })
                          }
                        >
                          <a>
                            <Thumbnail
                              style={
                                project.image
                                  ? {
                                      backgroundImage: `url('${project.image.image_medium_url}')`,
                                    }
                                  : undefined
                              }
                            />
                            <span className="ts-medium tw-medium block">
                              {project.name}
                            </span>
                          </a>
                        </Link>
                        <span className="ts-small tc-muted-dark block mb-1">
                          {project.description}
                        </span>
                        {project.published_date && (
                          <span className="block ts-small tc-muted">
                            <Icon name="access_time" className="mr-1" />
                            Publicada {moment(project.published_date).fromNow()}
                          </span>
                        )}
                      </ProjectHead>
                    </td>
                    <td style={{ width: 100 }} className="ta-right">
                      <ProjectStatusPill project={project} />
                    </td>
                    <td style={{ width: 230 }} className="pr-4">
                      <div className="btn-group float-right">
                        <Link
                          href={
                            organization
                              ? Page.OrganizationDashboardProject
                              : Page.ViewerProjectDashboard
                          }
                          as={
                            organization
                              ? PageAs.OrganizationDashboardProject({
                                  organizationSlug: organization.slug,
                                  projectSlug: project.slug,
                                })
                              : PageAs.ViewerProjectDashboard({
                                  projectSlug: project.slug,
                                })
                          }
                        >
                          <a className="btn btn-outline-primary">
                            Gerenciar vaga
                          </a>
                        </Link>
                        <DropdownWithContext>
                          <DropdownToggler>
                            <button className="btn btn-outline-primary px-1">
                              <Icon name="keyboard_arrow_down" />
                            </button>
                          </DropdownToggler>
                          <ContextMenu>
                            <Link
                              href={
                                organization
                                  ? Page.OrganizationEditProject
                                  : Page.EditProject
                              }
                              as={
                                organization
                                  ? PageAs.OrganizationEditProject({
                                      projectSlug: project.slug,
                                      organizationSlug: organization.slug,
                                      stepId: 'geral',
                                    })
                                  : PageAs.EditProject({
                                      projectSlug: project.slug,
                                      stepId: 'geral',
                                    })
                              }
                              passHref
                            >
                              <DropdownAnchor className="dropdown-item">
                                Editar vaga
                              </DropdownAnchor>
                            </Link>
                            <Link
                              href={
                                organization
                                  ? Page.OrganizationDuplicateProject
                                  : Page.DuplicateProject
                              }
                              as={
                                organization
                                  ? PageAs.OrganizationDuplicateProject({
                                      projectSlug: project.slug,
                                      organizationSlug: organization.slug,
                                      stepId: 'geral',
                                    })
                                  : PageAs.DuplicateProject({
                                      projectSlug: project.slug,
                                      stepId: 'geral',
                                    })
                              }
                              passHref
                            >
                              <DropdownAnchor className="dropdown-item">
                                Duplicar vaga
                              </DropdownAnchor>
                            </Link>

                            <Link
                              href={Page.Project}
                              as={PageAs.Project({ projectSlug: project.slug })}
                              passHref
                            >
                              <DropdownAnchor className="dropdown-item">
                                Visualizar vaga
                              </DropdownAnchor>
                            </Link>
                          </ContextMenu>
                        </DropdownWithContext>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
          {(queryResult.loading ||
            (queryResult.data && queryResult.data.next)) && (
            <div className="card-item p-5 ta-center">
              <Waypoint onEnter={handleLoadMoreProjectsCallback} />
              <ActivityIndicator size={64} className="mb-2" />
              <span className="block tc-muted">Carregando vagas...</span>
            </div>
          )}
          {!queryResult.loading &&
            queryResult.data &&
            !queryResult.data.next && (
              <div className="card-item p-5 ta-center tc-muted">
                Não há mais vagas
              </div>
            )}
        </div>
      </Card>
    </div>
  )

  return (
    <PageStyled className="bg-muted">
      {organization ? (
        <OrganizationLayout
          layoutProps={{ disableFooter: true }}
          isCurrentUserMember
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
