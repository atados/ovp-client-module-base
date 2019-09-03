import Link from 'next/link'
import React from 'react'
import { Waypoint } from 'react-waypoint'
import styled, { keyframes } from 'styled-components'
import { Page, PageAs } from '~/common'
import Icon from '~/components/Icon'
import OrganizationCard from '~/components/OrganizationCard'
import ProjectCard from '~/components/ProjectCard'
import { range } from '~/lib/utils/array'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
import {
  BaseFiltersJSON,
  NodeKind,
  SearchSource,
  SearchType,
} from '~/redux/ducks/search'

const blink = keyframes`
  0% {
   opacity: 1;
 }

  50% {
  opacity: 0.5;
 }

  100% {
  opacity: 1;
 }
`
const NodePlaceholder = styled.span`
  display: block;
  height: 380px;
  width: 100%;
  background: #eee;
  border-radius: 3px;
  animation: ${blink} 1s ease-in-out 0s infinite normal;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #484848;
  margin-bottom: 2px;
`

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #666;
`

export enum SearchSourcesSize {
  Large,
}

interface SearchSourcesProps {
  readonly className?: string
  readonly size?: SearchSourcesSize
  readonly sources: Array<SearchSource<Project | Organization>>
  readonly page: number
  readonly fetching?: boolean
  readonly searchType?: SearchType
  readonly filtersQueryObject: BaseFiltersJSON
  readonly onNextWaypointPositionChange?: (
    waypointState: Waypoint.CallbackArgs,
  ) => any
  readonly refWaypoint?: (ref: HTMLDivElement | null) => any
}

const SearchSources: React.FC<SearchSourcesProps> = ({
  size,
  fetching,
  searchType,
  sources,
  page,
  filtersQueryObject,
  refWaypoint,
  onNextWaypointPositionChange,
}) => {
  const areAllSourcesEmpty =
    !fetching && !sources.some(source => source.nodes.length > 0)
  const hasNextPage = sources.some(source => {
    if (
      searchType === SearchType.Any &&
      source.nodeKind === NodeKind.Organization
    ) {
      return false
    }

    return !!source.nextURI
  })

  return (
    <>
      {!(fetching && page <= 1) &&
        sources.map((source, sourceIndex) => {
          const isLastSource = sourceIndex === sources.length - 1

          if (!source.nodes.length) {
            return null
          }

          if (
            source.nodeKind === NodeKind.Organization &&
            searchType !== SearchType.Projects
          ) {
            return (
              <div key={source.id} className="mb-4">
                <SectionTitle>ONGs</SectionTitle>
                <SectionSubtitle>
                  Aproximadamente {source.count} ONGs
                </SectionSubtitle>
                <div className="row">
                  {(source as SearchSource<Organization>).nodes.map(
                    (node, nodeIndex) => (
                      <div
                        key={node.slug}
                        className={`col-6 col-md-3 mb-4 ${
                          size === SearchSourcesSize.Large ? '' : 'col-lg-2'
                        }`}
                      >
                        {isLastSource &&
                          nodeIndex === source.nodes.length - 21 && (
                            <span ref={refWaypoint} />
                          )}
                        <OrganizationCard organization={node} />
                      </div>
                    ),
                  )}
                </div>
                {searchType === SearchType.Any && source.count > 4 && (
                  <Link
                    href={{
                      pathname: Page.SearchOrganizations,
                      query: {
                        ...(filtersQueryObject as any),
                        searchType: SearchType.Organizations,
                      },
                    }}
                    as={{
                      pathname: PageAs.SearchOrganizations(),
                      query: {
                        ...(filtersQueryObject as any),
                        searchType: SearchType.Organizations,
                      },
                    }}
                  >
                    <a className="tc-secondary-500 ts-medium">
                      Ver tudo {source.count > 6 && `(+ ${source.count - 6})`}{' '}
                      <Icon name="arrow_forward" />
                    </a>
                  </Link>
                )}
              </div>
            )
          }

          if (
            source.nodeKind === NodeKind.Project &&
            searchType !== SearchType.Organizations
          ) {
            return (
              <div key={source.id} className="mb-4">
                <SectionTitle>Vagas</SectionTitle>
                <SectionSubtitle>
                  Aproximadamente {source.count} vagas abertas
                </SectionSubtitle>
                <div className="row">
                  {(source as SearchSource<Project>).nodes.map(
                    (node, nodeIndex) => (
                      <div
                        key={node.slug}
                        className={`col-sm-6 col-lg-${
                          size === SearchSourcesSize.Large ? '4' : '3'
                        } mb-4`}
                      >
                        {isLastSource &&
                          nodeIndex === source.nodes.length - 21 && (
                            <span ref={refWaypoint} />
                          )}
                        <ProjectCard {...node} />
                      </div>
                    ),
                  )}
                </div>
                {searchType === SearchType.Any &&
                  !onNextWaypointPositionChange &&
                  source.count > 4 && (
                    <Link
                      href={{
                        pathname: Page.SearchProjects,
                        query: {
                          ...(filtersQueryObject as any),
                          searchType: SearchType.Projects,
                        },
                      }}
                      as={{
                        pathname: PageAs.SearchProjects(),
                        query: {
                          ...(filtersQueryObject as any),
                          searchType: SearchType.Projects,
                        },
                      }}
                    >
                      <a className="tc-secondary-500 ts-medium">
                        Ver tudo {source.count > 6 && `(+ ${source.count - 6})`}{' '}
                        <Icon name="arrow_forward" />
                      </a>
                    </Link>
                  )}
              </div>
            )
          }
        })}

      {(fetching || (onNextWaypointPositionChange && hasNextPage)) && (
        <div>
          {(page === 0 || (page === 1 && fetching)) && (
            <>
              <NodePlaceholder
                className="mb-2"
                style={{ width: '25%', height: '28px' }}
              />
              <NodePlaceholder
                className="mb-3"
                style={{ width: '50%', height: '24px' }}
              />
            </>
          )}
          <div className="row">
            {onNextWaypointPositionChange && (
              <Waypoint onPositionChange={onNextWaypointPositionChange} />
            )}
            {range<React.ReactNode>(20, i => (
              <div
                key={i}
                className={
                  searchType === SearchType.Organizations
                    ? `col-6 col-md-3 mb-4${
                        size === SearchSourcesSize.Large ? '' : ' col-lg-2'
                      }`
                    : `col-sm-6 col-lg-${
                        size === SearchSourcesSize.Large ? '4' : '3'
                      } mb-4`
                }
              >
                <NodePlaceholder />
              </div>
            ))}
          </div>
        </div>
      )}

      {areAllSourcesEmpty && (
        <div className="py-5">
          <h1 className="tw-normal h2">Infelizmente não encontramos nada :(</h1>
          <p>Tente ajustar a sua busca. Aqui estão algumas ideias:</p>
          <ul className="mb-3">
            <li>Altere os filtros</li>
            <li>Busque por uma cidade, endereço ou ponto específico</li>
            <li>Busque vagas à distância</li>
          </ul>
          <Link
            href={{
              pathname:
                searchType === SearchType.Any
                  ? Page.Search
                  : searchType === SearchType.Projects
                  ? Page.SearchProjects
                  : Page.SearchOrganizations,
              query: { searchType },
            }}
            as={
              searchType === SearchType.Any
                ? PageAs.Search()
                : searchType === SearchType.Projects
                ? PageAs.SearchProjects()
                : PageAs.SearchOrganizations()
            }
          >
            <a className="btn btn-primary">
              Remover todos os filtros
              <Icon name="close" className="ml-2" />
            </a>
          </Link>
        </div>
      )}

      {searchType !== SearchType.Organizations &&
        !filtersQueryObject.remoteOnly && (
          <>
            <hr />
            <p className="py-1 tc-muted">
              Ainda não encontrou a vaga certa?{' '}
              <Link
                href={{
                  pathname: Page.Search,
                  query: { searchType, remoteOnly: true },
                }}
                as={`${
                  searchType === SearchType.Any
                    ? Page.Search
                    : Page.SearchProjects
                }?remoteOnly=true`}
              >
                <a className="tw-medium tc-secondary-500">
                  Busque somente vagas a distância.
                </a>
              </Link>
            </p>
          </>
        )}
    </>
  )
}
SearchSources.displayName = 'SearchSources'

export default SearchSources
