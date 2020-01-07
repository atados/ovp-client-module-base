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
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

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

const {
  APROXIMADAMENTE,
  ONGS,
  VER_TUDO,
  VAGAS_ABERTAS,
  VAGAS,
  ERROR_TITLE,
  ERROR_SUBTITLE,
  ERROR_L1,
  ERROR_L2,
  ERROR_L3,
  REMOVER_FILTROS,
  NAO_ENCONTROU,
  BUSQUE,
} = defineMessages({
  APROXIMADAMENTE: {
    id: 'APROXIMADAMENTE',
    defaultMessage: 'Aproximadamente',
  },
  ONGS: {
    id: 'ONGS',
    defaultMessage: 'ONGs',
  },
  VAGAS: {
    id: 'VAGAS',
    defaultMessage: 'Vagas',
  },
  VER_TUDO: {
    id: 'VER_TUDO',
    defaultMessage: 'Ver tudo',
  },
  VAGAS_ABERTAS: {
    id: 'VAGAS_ABERTAS',
    defaultMessage: 'vagas abertas',
  },
  ERROR_TITLE: {
    id: 'ERROR_TITLE',
    defaultMessage: 'Infelizmente não encontramos nada ',
  },
  ERROR_SUBTITLE: {
    id: 'ERROR_SUBTITLE',
    defaultMessage: 'Tente ajustar a sua busca. Aqui estão algumas ideias:',
  },
  ERROR_L1: {
    id: 'ERROR_L1',
    defaultMessage: 'Altere os filtros',
  },
  ERROR_L2: {
    id: 'ERROR_L2',
    defaultMessage: 'Busque por uma cidade, endereço ou ponto específico',
  },
  ERROR_L3: {
    id: 'ERROR_L3',
    defaultMessage: 'Busque vagas à distância',
  },
  REMOVER_FILTROS: {
    id: 'REMOVER_FILTROS',
    defaultMessage: 'Remover todos os filtros',
  },
  NAO_ENCONTROU: {
    id: 'NAO_ENCONTROU',
    defaultMessage: 'Ainda não encontrou a vaga certa?',
  },
  BUSQUE: {
    id: 'BUSQUE',
    defaultMessage: 'Busque somente vagas a distância.',
  },
})

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
  const intl = useIntl()

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
              <div key={source.id} className="mb-6">
                <SectionTitle>{intl.formatMessage(ONGS)}</SectionTitle>
                <SectionSubtitle>
                  {`${intl.formatMessage(APROXIMADAMENTE)} ${
                    source.count
                  } ${intl.formatMessage(ONGS)}`}
                </SectionSubtitle>
                <div className="flex flex-wrap -mx-2">
                  {(source as SearchSource<Organization>).nodes.map(
                    (node, nodeIndex) => (
                      <div
                        key={node.slug}
                        className={`px-2 w-1/2 md:w-1/4 mb-6 ${
                          size === SearchSourcesSize.Large ? '' : 'lg:w-1/6'
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
                    <a className="text-secondary-500 text-lg">
                      {intl.formatMessage(VER_TUDO)}{' '}
                      {source.count > 6 && `(+ ${source.count - 6})`}{' '}
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
              <div key={source.id} className="mb-6">
                <SectionTitle>{intl.formatMessage(VAGAS)}</SectionTitle>
                <SectionSubtitle>
                  {`${intl.formatMessage(APROXIMADAMENTE)} ${
                    source.count
                  } ${intl.formatMessage(VAGAS_ABERTAS)}`}
                </SectionSubtitle>
                <div className="-mx-2 flex flex-wrap">
                  {(source as SearchSource<Project>).nodes.map(
                    (node, nodeIndex) => (
                      <div
                        key={node.slug}
                        className={`w-full sm:w-1/2 ${
                          size === SearchSourcesSize.Large
                            ? 'lg:w-1/3'
                            : 'lg:w-1/4'
                        } px-2 mb-6`}
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
                      <a className="text-secondary-500 text-lg">
                        {intl.formatMessage(VER_TUDO)}
                        {source.count > 6 && `(+ ${source.count - 6})`}{' '}
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
                className="mb-4"
                style={{ width: '50%', height: '24px' }}
              />
            </>
          )}
          <div className="flex flex-wrap -mx-2">
            {onNextWaypointPositionChange && (
              <Waypoint onPositionChange={onNextWaypointPositionChange} />
            )}
            {range<React.ReactNode>(20, i => (
              <div
                key={i}
                className={
                  searchType === SearchType.Organizations
                    ? `w-1/2 md:1/-4 mb-6${
                        size === SearchSourcesSize.Large ? '' : ' lg:1/6'
                      }`
                    : `sm:w-1/2 w-full px-2 mb-6 ${
                        size === SearchSourcesSize.Large
                          ? 'lg:w-1/3'
                          : 'lg:w-1/4'
                      }`
                }
              >
                <NodePlaceholder />
              </div>
            ))}
          </div>
        </div>
      )}

      {areAllSourcesEmpty && (
        <div className="py-8">
          <h1 className="font-normal h2">{`${intl.formatMessage(
            ERROR_TITLE,
          )} :(`}</h1>
          <p>{intl.formatMessage(ERROR_SUBTITLE)}</p>
          <ul className="mb-4">
            <li>{intl.formatMessage(ERROR_L1)}</li>
            <li>{intl.formatMessage(ERROR_L2)}</li>
            <li>{intl.formatMessage(ERROR_L3)}</li>
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
              {intl.formatMessage(REMOVER_FILTROS)}
              <Icon name="close" className="ml-2" />
            </a>
          </Link>
        </div>
      )}

      {searchType !== SearchType.Organizations &&
        !filtersQueryObject.remoteOnly && (
          <>
            <hr />
            <p className="py-2 text-gray-600">
              {`${intl.formatMessage(NAO_ENCONTROU)} `}
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
                <a className="font-medium text-secondary-500">
                  {intl.formatMessage(BUSQUE)}
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
