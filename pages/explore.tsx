import { connect, useDispatch, useSelector } from 'react-redux'
import { defineMessages, WithIntlProps } from 'react-intl'
import { Waypoint } from 'react-waypoint'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import styled from 'styled-components'
import Link from 'next/link'

import { SearchSourcesSize } from '~/components/SearchSources/SearchSources'
import ReduxGoogleMap from '~/components/GoogleMap/ReduxGoogleMap'
import ActivityIndicator from '~/components/ActivityIndicator'
import { mountAddressFilter } from '~/lib/utils/geo-location'
import { fetchMapMarks } from '~/redux/ducks/search-marks'
import { Organization } from '~/redux/ducks/organization'
import { Mark } from '~/components/GoogleMap/GoogleMap'
import SearchFilters from '~/components/SearchFilters'
import SearchSources from '~/components/SearchSources'
import useStartupData from '~/hooks/use-startup-data'
import { RootState } from '~/redux/root-reducer'
import { reportError } from '~/lib/utils/error'
import { Geolocation } from '~/redux/ducks/geo'
import { Project } from '~/redux/ducks/project'
import { Page, PageAs, Config } from '~/common'
import Layout from '~/components/Layout'
import { withIntl } from '~/lib/intl'
import Meta from '~/components/Meta'
import Icon from '~/components/Icon'
import {
  BaseFilters,
  BaseFiltersJSON,
  fetchNextSearchPage,
  mapFiltersToQueryObject,
  mapQueryToFilters,
  NodeKind,
  search,
  searchOrganizations,
  searchProjects,
  SearchSource,
  SearchType,
} from '~/redux/ducks/search'

const Container = styled.div`
  padding-top: ${Config.toolbar.height + 56}px;

  @media (min-width: 992px) {
    &.map-rendered {
      width: auto !important;
      max-width: none !important;
      padding-right: 430px !important;
    }
  }
`
const Header = styled.div`
  height: 56px;
  position: fixed;
  top: ${Config.toolbar.height}px;
  left: 10px;
  right: 10px;
  background: #fff;
  z-index: 35;

  @media (max-width: 568px) {
    padding: 0;
    width: auto;

    > div > div > div:last-child {
      padding-right: 5px;
    }
  }
`

const HeaderInner = styled.div`
  height: 56px;
  box-shadow: 0 1px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  position: relative;

  > div {
    position: absolute;
    bottom: 0;
    padding: 12px 10px;
    top: 0;
    left: -10px;
    right: -10px;
    overflow-x: auto;

    @media (max-width: 568px) {
      left: -10px;
      right: -10px;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &.filters-open > div {
    height: 100vh;
    background: rgba(255, 255, 255, 0.5);
  }
`

const Body = styled.div`
  position: relative;
  padding-top: 10px;
`

const Option = styled.a`
  background: #f5f6f7;
  width: 100%;
  max-width: 300px;
  color: #333;
  border-radius: 10px;
`

const Map = styled(ReduxGoogleMap)`
  position: fixed;
  width: 400px;
  top: ${Config.toolbar.height + 71}px;
  right: 10px;
  bottom: 10px;
`

const {
  TITLE,
  BUSCAR_SOMENTE,
  VAGAS,
  ONGS,
  INCLUIR,
  NA_BUSCA,
  ENCONTRADAS,
  CARREGANDO,
} = defineMessages({
  TITLE: {
    id: 'TITLE',
    defaultMessage: 'Explorar',
  },
  BUSCAR_SOMENTE: {
    id: 'BUSCAR_SOMENTE',
    defaultMessage: 'Buscar somente',
  },
  VAGAS: {
    id: 'VAGAS',
    defaultMessage: 'Vagas',
  },
  ONGS: {
    id: 'ONGS',
    defaultMessage: 'Ongs',
  },
  INCLUIR: {
    id: 'INCLUIR',
    defaultMessage: 'Incluir',
  },
  NA_BUSCA: {
    id: 'NA_BUSCA',
    defaultMessage: 'na busca',
  },
  ENCONTRADAS: {
    id: 'ENCONTRADAS',
    defaultMessage: 'encontradas',
  },
  CARREGANDO: {
    id: 'CARREGANDO',
    defaultMessage: 'Carregando...',
  },
})

interface ExplorePageProps {
  readonly mapDefaultCenter: Mark
  readonly geo: Geolocation
  readonly page: number
  readonly projectsCount?: number
  readonly organizationsCount?: number
  readonly fetching: boolean
  readonly filtersQueryObject: BaseFiltersJSON
  readonly onFetchNextPage: (sourceIds: string[]) => any
  readonly filters: BaseFilters
  readonly sources: Array<SearchSource<Project | Organization>>
  readonly className?: string
  readonly searchType?: SearchType
  readonly marks: Mark[]
}

interface ExplorePageState {
  readonly mustScrollUpOnFetched: boolean
  readonly showMap: boolean
  readonly isAnyFilterOpen?: boolean
}

class ExplorePage extends React.Component<
  ExplorePageProps & WithIntlProps<any>,
  ExplorePageState
> {
  private waypointContainerRef: HTMLSpanElement | null

  constructor(props: ExplorePageProps) {
    super(props)

    this.state = { mustScrollUpOnFetched: false, showMap: false }
  }

  public componentDidUpdate(prevProps: ExplorePageProps) {
    // Scroll to first project cards row when fetched
    if (
      prevProps.page !== this.props.page &&
      !this.props.fetching &&
      this.state.mustScrollUpOnFetched &&
      this.waypointContainerRef
    ) {
      this.waypointContainerRef.scrollIntoView()
    }
  }

  public fetchNextPage = () => {
    const { searchType, sources, onFetchNextPage } = this.props

    if (searchType === SearchType.Any) {
      onFetchNextPage(
        sources
          .filter(source => source.nodeKind === NodeKind.Project)
          .map(source => source.id),
      )
    } else {
      onFetchNextPage(sources.map(source => source.id))
    }
  }

  public handleNextPageTriggerPositionChange = (
    waypointState: Waypoint.CallbackArgs,
  ) => {
    const mustScrollUpOnFetched =
      waypointState.currentPosition === Waypoint.above ||
      waypointState.currentPosition === Waypoint.inside

    if (this.state.mustScrollUpOnFetched !== mustScrollUpOnFetched) {
      this.setState({ mustScrollUpOnFetched })
    }

    if (mustScrollUpOnFetched) {
      this.fetchNextPage()
    }
  }

  public handleWaypointContainerRefFn = (ref: HTMLDivElement | null) => {
    this.waypointContainerRef = ref
  }

  public handleMapSwitchChange = (visible: boolean) => {
    this.setState({ showMap: visible })
  }

  public handleFilterOpenStateChange = (isAnyFilterOpen: boolean) => {
    this.setState({ isAnyFilterOpen })
  }

  public render() {
    const {
      page,
      fetching,
      searchType,
      filtersQueryObject,
      filters,
      sources,
      projectsCount,
      organizationsCount,
      mapDefaultCenter,
      marks,
      intl,
    } = this.props
    const { showMap, isAnyFilterOpen } = this.state
    const filtersQueryString = queryString.stringify(filtersQueryObject as any)
    const renderMap = Boolean(showMap && searchType !== SearchType.Any)

    return (
      <Layout toolbarProps={{ fixed: true }} disableFooter>
        <Meta title={intl.formatMessage(TITLE)} />
        <Container
          className={`px-3 container${renderMap ? ' map-rendered' : ''}`}
        >
          <Header className={renderMap ? '' : 'md:px-3 container'}>
            <HeaderInner className={isAnyFilterOpen ? 'filters-open' : ''}>
              <SearchFilters
                mapToggleChecked={renderMap}
                onMapSwitchChange={this.handleMapSwitchChange}
                searchType={searchType}
                value={filters}
                onOpenStateChange={this.handleFilterOpenStateChange}
              />
            </HeaderInner>
          </Header>
          <Body>
            {searchType === SearchType.Any && (
              <div className="mb-6">
                <Link
                  href={{
                    pathname: Page.SearchProjects,
                    query: {
                      ...(filtersQueryObject as any),
                      searchType: SearchType.Projects,
                    },
                  }}
                  as={`${PageAs.SearchProjects()}?${filtersQueryString}`}
                >
                  <Option
                    href={`/vagas/?${filtersQueryString}`}
                    className="btn btn--size-3 text-left mb-4 md:mb-0"
                  >
                    <div className="media">
                      <div className="media-body">
                        <span className="font-normal block text-sm mb-1">
                          {intl.formatMessage(BUSCAR_SOMENTE)}
                        </span>
                        <span className="text-xl">
                          {`${intl.formatMessage(VAGAS)} `}
                          <span className="font-normal text-base text-gray-600">
                            {' '}
                            {fetching
                              ? `- ${intl.formatMessage(CARREGANDO)}`
                              : `- ${projectsCount} ${intl.formatMessage(
                                  ENCONTRADAS,
                                )}`}
                          </span>
                        </span>
                      </div>
                      <Icon name="arrow_forward" className="ml-2" />
                    </div>
                  </Option>
                </Link>
                <Link
                  href={{
                    pathname: Page.SearchOrganizations,
                    query: {
                      ...(filtersQueryObject as any),
                      searchType: SearchType.Organizations,
                    },
                  }}
                  as={`${PageAs.SearchOrganizations()}?${filtersQueryString}`}
                  passHref
                >
                  <Option className="btn btn--size-3 text-left md:ml-4">
                    <div className="media">
                      <div className="media-body">
                        <span className="font-normal block text-sm mb-1">
                          {intl.formatMessage(BUSCAR_SOMENTE)}
                        </span>
                        <span className="text-xl">
                          {intl.formatMessage(ONGS)}
                        </span>{' '}
                        <span className="font-normal text-base text-gray-600">
                          {' '}
                          {fetching
                            ? `- ${intl.formatMessage(CARREGANDO)}`
                            : `- ${organizationsCount} ${intl.formatMessage(
                                ENCONTRADAS,
                              )}`}
                        </span>
                      </div>
                      <Icon name="arrow_forward" className="ml-2" />
                    </div>
                  </Option>
                </Link>
              </div>
            )}
            {searchType !== SearchType.Any && (
              <Link
                href={{
                  pathname: Page.Search,
                  query: filtersQueryObject as any,
                }}
                as={`${PageAs.Search()}?${filtersQueryString}`}
              >
                <a className="text-secondary-500 float-right">
                  {`${intl.formatMessage(INCLUIR)} `}
                  {searchType === SearchType.Projects
                    ? intl.formatMessage(ONGS)
                    : intl.formatMessage(VAGAS)}
                  {` ${intl.formatMessage(NA_BUSCA)}`}
                  <Icon name="arrow_forward" className="ml-2" />
                </a>
              </Link>
            )}
            <SearchSources
              size={renderMap ? SearchSourcesSize.Large : undefined}
              page={page}
              sources={sources}
              fetching={fetching}
              searchType={searchType}
              filtersQueryObject={filtersQueryObject}
              refWaypoint={this.handleWaypointContainerRefFn}
              onNextWaypointPositionChange={
                this.handleNextPageTriggerPositionChange
              }
            />
          </Body>
          {renderMap && (
            <Map
              className="hidden lg:block"
              defaultCenter={mapDefaultCenter}
              defaultZoom={12}
              marks={marks}
              nodeKind={
                searchType === SearchType.Projects
                  ? NodeKind.Project
                  : NodeKind.Organization
              }
            />
          )}
        </Container>
      </Layout>
    )
  }
}

const mapStateToProps = ({
  geo,
  search: searchState,
  searchMarks,
}: RootState): Partial<ExplorePageProps> => {
  let projectsCount = 0
  let organizationsCount = 0
  let mapDefaultCenter: Mark | undefined

  if (searchState.sources) {
    searchState.sources.forEach(source => {
      if (source.nodeKind === NodeKind.Project) {
        projectsCount += source.count
      }

      if (source.nodeKind === NodeKind.Organization) {
        organizationsCount += source.count
      }

      if (!mapDefaultCenter && source.nodes[0] && source.nodes[0].address) {
        // Set mapDefaultCenter based on first node address
        mapDefaultCenter = {
          lat: source.nodes[0].address!.lat,
          lng: source.nodes[0].address!.lng,
        }
      }
    })
  }

  const marks: Mark[] = []
  const marksMustBeKind =
    searchState.searchType === SearchType.Projects
      ? NodeKind.Project
      : searchState.searchType === SearchType.Organizations
      ? NodeKind.Organization
      : undefined
  searchMarks.sources.forEach(mapSource => {
    if (mapSource.nodeKind !== marksMustBeKind) {
      return
    }

    mapSource.nodes.map(node => {
      if (node.address) {
        marks.push({
          id: node.slug,
          lat: node.address.lat,
          lng: node.address.lng,
        })
      }
    })
  })

  return {
    geo,
    projectsCount,
    organizationsCount,
    filtersQueryObject: mapFiltersToQueryObject(searchState.filters),
    fetching: searchState.fetching,
    searchType: searchState.searchType,
    page: searchState.page,
    sources: searchState.sources,
    filters: searchState.filters || {},
    marks,
    mapDefaultCenter: mapDefaultCenter || {
      lat: Config.geolocation.default.latitude,
      lng: Config.geolocation.default.longitude,
    },
  }
}

const ConnectedExplorePage = connect(mapStateToProps, {
  onFetchNextPage: fetchNextSearchPage,
})(withIntl(ExplorePage))

const NewExplorePage = () => {
  const dispatch = useDispatch()
  const startup = useStartupData()
  const geo = useSelector((state: RootState) => state.geo)
  const router = useRouter()

  useEffect(() => {
    if (!router || !startup.data) {
      return
    }

    const { searchType, ...jsonFilters } = router.query
    const fn = async () => {
      const filters: BaseFilters = mapQueryToFilters(jsonFilters)

      if (!filters.remoteOnly) {
        filters.address = mountAddressFilter(geo, filters.address)
      }

      try {
        if (String(searchType) === String(SearchType.Projects)) {
          await dispatch(searchProjects(filters))
          await dispatch(
            fetchMapMarks({
              filters: { ...filters, address: undefined, length: undefined },
              nodeKind: NodeKind.Project,
            }),
          )
        } else if (String(searchType) === String(SearchType.Organizations)) {
          await dispatch(searchOrganizations({ ...filters, length: 18 }))
          await dispatch(
            fetchMapMarks({
              filters: { ...filters, address: undefined, length: undefined },
              nodeKind: NodeKind.Organization,
            }),
          )
        } else {
          await dispatch(
            search({
              ...filters,
              organizationsLength: 6,
              projectsLength: 20,
            }),
          )
        }
      } catch (error) {
        reportError(error)
      }
    }

    fn()
  }, [router, startup])

  if (!router || !startup.data) {
    return (
      <Layout className="relative min-h-screen">
        <ActivityIndicator
          className="absolute top-0 right-0 bottom-0 left-0 m-auto"
          size={56}
        />
      </Layout>
    )
  }

  return <ConnectedExplorePage />
}

export default NewExplorePage
