import { NextPageContext } from 'next'
import Link from 'next/link'
import queryString from 'query-string'
import React from 'react'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { Mark } from '~/components/GoogleMap/GoogleMap'
import ReduxGoogleMap from '~/components/GoogleMap/ReduxGoogleMap'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import SearchFilters from '~/components/SearchFilters'
import SearchSources from '~/components/SearchSources'
import { SearchSourcesSize } from '~/components/SearchSources/SearchSources'
import { reportError } from '~/lib/utils/error'
import { mountAddressFilter } from '~/lib/utils/geo-location'
import { Geolocation } from '~/redux/ducks/geo'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
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
import { fetchMapMarks } from '~/redux/ducks/search-marks'
import { RootState } from '~/redux/root-reducer'
import { Page, PageAs } from '~/common'

const Container = styled.div`
  padding-top: ${props => props.theme.toolbarHeight + 56}px;

  @media (min-width: 992px) {
    &.map-rendered {
      width: auto !important;
      max-width: none !important;
      padding-right: 430px;
    }
  }
`
const Header = styled.div`
  height: 56px;
  position: fixed;
  top: ${props => props.theme.toolbarHeight}px;
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
  top: ${props => props.theme.toolbarHeight + 71}px;
  right: 10px;
  bottom: 10px;
`

let causesMapById: { [causeId: number]: string } | undefined

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

class ExplorePage extends React.Component<ExplorePageProps, ExplorePageState> {
  public static async getInitialProps({
    store,
    query: { searchType, ...jsonFilters },
  }: NextPageContext) {
    const {
      geo,
      startup: { causes },
    } = store.getState()
    const filters: BaseFilters = mapQueryToFilters(jsonFilters)

    if (!causesMapById) {
      causesMapById = {}
      causes.forEach(cause => {
        causesMapById![cause.id] = cause.name
      })
    }

    if (!filters.address && !filters.remoteOnly) {
      filters.address = mountAddressFilter(geo)
    }

    try {
      if (String(searchType) === String(SearchType.Projects)) {
        await store.dispatch(searchProjects(filters))
        await store.dispatch(
          fetchMapMarks({
            filters: { ...filters, address: undefined, length: undefined },
            nodeKind: NodeKind.Project,
          }),
        )
      } else if (String(searchType) === String(SearchType.Organizations)) {
        await store.dispatch(searchOrganizations({ ...filters, length: 18 }))
        await store.dispatch(
          fetchMapMarks({
            filters: { ...filters, address: undefined, length: undefined },
            nodeKind: NodeKind.Organization,
          }),
        )
      } else {
        await store.dispatch(
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

    return {}
  }

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
    } = this.props
    const { showMap, isAnyFilterOpen } = this.state
    const filtersQueryString = queryString.stringify(filtersQueryObject as any)
    const renderMap = Boolean(showMap && searchType !== SearchType.Any)

    return (
      <Layout toolbarProps={{ fixed: true }} disableFooter>
        <Meta title="Explorar" />
        <Container className={`container${renderMap ? ' map-rendered' : ''}`}>
          <Header className={renderMap ? '' : ' container'}>
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
              <div className="mb-4">
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
                    className="btn btn--size-3 ta-left mb-3 mb-md-0"
                  >
                    <div className="media">
                      <div className="media-body">
                        <span className="tw-normal block ts-small mb-1">
                          Buscar somente
                        </span>
                        <span className="ts-large">
                          Vagas{' '}
                          <span className="tw-normal ts-normal tc-muted">
                            {' '}
                            {fetching
                              ? '- Carregando...'
                              : `- ${projectsCount} encontradas`}
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
                  <Option className="btn btn--size-3 ta-left ml-md-3">
                    <div className="media">
                      <div className="media-body">
                        <span className="tw-normal block ts-small mb-1">
                          Buscar somente
                        </span>
                        <span className="ts-large">ONGs</span>{' '}
                        <span className="tw-normal ts-normal tc-muted">
                          {' '}
                          {fetching
                            ? '- Carregando...'
                            : `- ${organizationsCount} encontradas`}
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
                <a className="tc-secondary-500 float-right">
                  Incluir{' '}
                  {searchType === SearchType.Projects ? 'ONGs' : 'vagas'} na
                  busca
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
    mapDefaultCenter: mapDefaultCenter || channel.config.geo.default,
  }
}

export default connect(
  mapStateToProps,
  { onFetchNextPage: fetchNextSearchPage },
)(ExplorePage)
